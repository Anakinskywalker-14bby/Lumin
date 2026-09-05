/**
 * Quiz schema + strict server-side validation.
 * Every answer is validated against an allow-list, so arbitrary strings can
 * never reach the database. Free-text fields are length-capped and stripped
 * of control characters.
 */

export const QUIZ_QUESTIONS = [
  {
    id: "skin_type",
    question: "How does your skin feel 30 minutes after washing your face?",
    options: [
      { label: "Dry / tight", value: "Dry" },
      { label: "Shiny all over", value: "Oily" },
      { label: "Shiny only in the T-zone (forehead, nose, chin)", value: "Combination" },
      { label: "Comfortable and balanced", value: "Normal" },
    ],
  },
  {
    id: "sensitivity",
    question: "How easily does your skin get red, itchy, or irritated?",
    options: [
      { label: "Very easily. It reacts to new products or weather changes.", value: "Sensitive" },
      { label: "Rarely. My skin handles most products.", value: "Resilient" },
    ],
  },
  {
    id: "primary_concern",
    question: "What is your #1 skin goal right now?",
    options: [
      { label: "Clear up breakouts & blackheads", value: "Concern_Acne" },
      { label: "Fade dark spots & acne marks", value: "Concern_Hyperpigmentation" },
      { label: "Fix dryness & flaky patches", value: "Concern_Dehydration" },
      { label: "Control excess oil & large pores", value: "Concern_Oil_Control" },
      { label: "Smooth texture & glowing skin", value: "Concern_Dullness" },
    ],
  },
  {
    id: "breakout_frequency",
    question: "How often do you experience breakouts?",
    options: [
      { label: "Constantly. Active breakouts most days.", value: "Acne_Severe" },
      { label: "Cyclically. Around my period or high stress.", value: "Acne_Hormonal" },
      { label: "Occasionally. A random pimple here and there.", value: "Acne_Mild" },
      { label: "Never. Breakouts aren't an issue for me.", value: "Acne_None" },
    ],
  },
  {
    id: "post_acne_marks",
    question: "What happens after a pimple heals?",
    options: [
      { label: "It leaves a dark or flat red mark for weeks", value: "PIH_Prone" },
      { label: "It disappears without leaving a mark", value: "PIH_None" },
    ],
  },
  {
    id: "routine_depth",
    question: "How many steps are you actually willing to do each day?",
    options: [
      { label: "Keep it minimal. 2 to 3 products.", value: "Routine_Simple" },
      { label: "Give me the full routine. 4+ products.", value: "Routine_Advanced" },
    ],
  },
  {
    id: "lifestyle",
    question: "What does a typical day look like for you?",
    options: [
      { label: "Mostly indoors (study, office, screens)", value: "Low_UV_High_BlueLight" },
      { label: "Frequently outdoors (commuting, workouts, active)", value: "High_UV" },
      { label: "Late nights & high stress (poor sleep, busy)", value: "High_Cortisol_Dullness" },
    ],
  },
  {
    id: "climate",
    question: "What's the weather like where you live right now?",
    options: [
      { label: "Hot / humid", value: "Texture_Preference_Gel" },
      { label: "Cold / dry / windy", value: "Texture_Preference_Cream" },
      { label: "Mild / changing seasons", value: "Texture_Preference_Lotion" },
    ],
  },
  {
    id: "current_treatments",
    question: "Are you currently using any of these?",
    options: [
      { label: "Prescription topical treatments (e.g. tretinoin, clindamycin)", value: "Contraindication_Retinoid" },
      { label: "Oral acne medication (e.g. isotretinoin)", value: "Contraindication_Extreme_Dryness" },
      { label: "None of the above", value: "Clear_For_Actives" },
    ],
  },
  {
    id: "pregnancy_status",
    question: "Are you currently pregnant or breastfeeding?",
    options: [
      { label: "Yes", value: "Filter_Out_Retinoids_SalicylicAcid" },
      { label: "No", value: "No_Pregnancy_Filters" },
    ],
  },
  {
    id: "monthly_spend",
    question: "Roughly how much do you spend on skincare per month?",
    options: [
      { label: "Under $25", value: "Spend_Under_25" },
      { label: "$25 to $50", value: "Spend_25_50" },
      { label: "$50 to $100", value: "Spend_50_100" },
      { label: "$100 to $200", value: "Spend_100_200" },
      { label: "Over $200", value: "Spend_Over_200" },
    ],
  },
] as const;

export const AGE_BANDS = ["18-24", "25-34", "35-44", "45-54", "55+"] as const;

export const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"] as const;

/** Allow-lists derived from the question definitions (single source of truth). */
const ALLOWED: Record<string, readonly string[]> = Object.fromEntries(
  QUIZ_QUESTIONS.map((q) => [q.id, q.options.map((o) => o.value)])
);

const CONTROL_CHARS = new RegExp("[\\u0000-\\u001F\\u007F]", "g");

/** Strip control chars, collapse whitespace, hard-cap length. */
export function sanitizeText(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input
    .replace(CONTROL_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export interface QuizPayload {
  full_name: string;
  age_band: string;
  gender: string;
  skin_type: string;
  sensitivity: string;
  primary_concern: string;
  breakout_frequency: string;
  post_acne_marks: string;
  routine_depth: string;
  lifestyle: string;
  climate: string;
  current_treatments: string;
  pregnancy_status: string;
  allergies: string;
  monthly_spend: string;
}

export type ValidationResult =
  | { ok: true; data: QuizPayload }
  | { ok: false; error: string };

/** Validate an untrusted quiz submission against the allow-lists. */
export function validateQuiz(raw: unknown): ValidationResult {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Invalid submission." };
  }
  const body = raw as Record<string, unknown>;

  const full_name = sanitizeText(body.full_name, 80);
  if (full_name.length < 1) return { ok: false, error: "Please enter your name." };

  const age_band = sanitizeText(body.age_band, 16);
  if (!(AGE_BANDS as readonly string[]).includes(age_band)) {
    return { ok: false, error: "Please select your age range." };
  }

  const gender = sanitizeText(body.gender, 32);
  if (!(GENDERS as readonly string[]).includes(gender)) {
    return { ok: false, error: "Please select an option for gender." };
  }

  const answers: Record<string, string> = {};
  for (const q of QUIZ_QUESTIONS) {
    const value = sanitizeText(body[q.id], 64);
    if (!ALLOWED[q.id].includes(value)) {
      return { ok: false, error: `Please answer: ${q.question}` };
    }
    answers[q.id] = value;
  }

  // Free text: optional, sanitized, capped.
  const allergies = sanitizeText(body.allergies, 500);

  return {
    ok: true,
    data: {
      full_name,
      age_band,
      gender,
      allergies,
      skin_type: answers.skin_type,
      sensitivity: answers.sensitivity,
      primary_concern: answers.primary_concern,
      breakout_frequency: answers.breakout_frequency,
      post_acne_marks: answers.post_acne_marks,
      routine_depth: answers.routine_depth,
      lifestyle: answers.lifestyle,
      climate: answers.climate,
      current_treatments: answers.current_treatments,
      pregnancy_status: answers.pregnancy_status,
      monthly_spend: answers.monthly_spend,
    },
  };
}
