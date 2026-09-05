import { describe, it, expect } from "vitest";
import {
  QUIZ_QUESTIONS,
  AGE_BANDS,
  GENDERS,
  sanitizeText,
  validateQuiz,
} from "@/lib/validation/quiz";

/** A submission that should always pass, built from the real allow-lists. */
function validPayload(overrides: Record<string, unknown> = {}) {
  const answers: Record<string, string> = {};
  for (const q of QUIZ_QUESTIONS) answers[q.id] = q.options[0].value;
  return {
    full_name: "Test User",
    age_band: AGE_BANDS[0],
    gender: GENDERS[0],
    allergies: "",
    ...answers,
    ...overrides,
  };
}

describe("sanitizeText", () => {
  it("returns an empty string for non-strings", () => {
    for (const bad of [null, undefined, 42, {}, [], true]) {
      expect(sanitizeText(bad, 50)).toBe("");
    }
  });

  it("strips control characters, including NUL and DEL", () => {
    const dirty = "a\u0000b\u001Fc\u007Fd";
    expect(sanitizeText(dirty, 50)).toBe("a b c d");
  });

  it("strips newlines and tabs used to fake multi-line input", () => {
    expect(sanitizeText("line1\nline2\tline3", 50)).toBe("line1 line2 line3");
  });

  it("collapses runs of whitespace and trims the edges", () => {
    expect(sanitizeText("  hello \n\t  world  ", 50)).toBe("hello world");
  });

  it("hard-caps length", () => {
    expect(sanitizeText("x".repeat(500), 10)).toHaveLength(10);
  });

  it("does not execute or unescape HTML — it is stored verbatim", () => {
    // Sanitizing is not escaping. We keep the raw text and rely on React's
    // contextual escaping at render time; this test documents that contract.
    const xss = '<script>alert("x")</script>';
    expect(sanitizeText(xss, 100)).toBe(xss);
  });
});

describe("validateQuiz — rejection", () => {
  it("rejects non-objects", () => {
    for (const bad of [null, undefined, "string", 7, []]) {
      const r = validateQuiz(bad);
      expect(r.ok).toBe(false);
    }
  });

  it("rejects a missing name", () => {
    const r = validateQuiz(validPayload({ full_name: "   " }));
    expect(r).toEqual({ ok: false, error: "Please enter your name." });
  });

  it("rejects an age band outside the allow-list", () => {
    const r = validateQuiz(validPayload({ age_band: "12-17" }));
    expect(r.ok).toBe(false);
  });

  it("rejects a gender outside the allow-list", () => {
    const r = validateQuiz(validPayload({ gender: "Robot" }));
    expect(r.ok).toBe(false);
  });

  it("rejects an arbitrary string for every single question", () => {
    for (const q of QUIZ_QUESTIONS) {
      const r = validateQuiz(validPayload({ [q.id]: "DROP TABLE waitlist" }));
      expect(r.ok, `${q.id} accepted an arbitrary value`).toBe(false);
    }
  });

  it("rejects a missing answer for every single question", () => {
    for (const q of QUIZ_QUESTIONS) {
      const r = validateQuiz(validPayload({ [q.id]: undefined }));
      expect(r.ok, `${q.id} accepted undefined`).toBe(false);
    }
  });

  it("rejects a label rather than its DB code", () => {
    // The UI shows labels; only the coded value may reach the database.
    const q = QUIZ_QUESTIONS[0];
    const r = validateQuiz(validPayload({ [q.id]: q.options[0].label }));
    expect(r.ok).toBe(false);
  });
});

describe("validateQuiz — acceptance", () => {
  it("accepts a well-formed submission", () => {
    const r = validateQuiz(validPayload());
    expect(r.ok).toBe(true);
  });

  it("accepts every declared option for every question", () => {
    for (const q of QUIZ_QUESTIONS) {
      for (const opt of q.options) {
        const r = validateQuiz(validPayload({ [q.id]: opt.value }));
        expect(r.ok, `${q.id}=${opt.value} was rejected`).toBe(true);
      }
    }
  });

  it("caps free-text allergies at 500 characters", () => {
    const r = validateQuiz(validPayload({ allergies: "n".repeat(2000) }));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.allergies).toHaveLength(500);
  });

  it("treats allergies as optional", () => {
    const r = validateQuiz(validPayload({ allergies: undefined }));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.allergies).toBe("");
  });

  it("drops unknown keys instead of passing them through to the DB", () => {
    const r = validateQuiz(validPayload({ is_admin: true, position: 1 }));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data).not.toHaveProperty("is_admin");
      expect(r.data).not.toHaveProperty("position");
    }
  });

  it("returns exactly the 15 expected fields", () => {
    const r = validateQuiz(validPayload());
    expect(r.ok).toBe(true);
    if (r.ok) expect(Object.keys(r.data).sort()).toEqual(
      [
        "age_band", "allergies", "breakout_frequency", "climate",
        "current_treatments", "full_name", "gender", "lifestyle",
        "monthly_spend", "post_acne_marks", "pregnancy_status",
        "primary_concern", "routine_depth", "sensitivity", "skin_type",
      ]
    );
  });
});

describe("quiz schema integrity", () => {
  it("has 11 multiple-choice questions (13 steps with name and demographics)", () => {
    expect(QUIZ_QUESTIONS).toHaveLength(11);
  });

  it("has unique question ids", () => {
    const ids = QUIZ_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique option values within each question", () => {
    for (const q of QUIZ_QUESTIONS) {
      const values = q.options.map((o) => o.value);
      expect(new Set(values).size, `${q.id} has duplicate values`).toBe(values.length);
    }
  });

  it("keeps every option value inside the 64-char sanitize cap", () => {
    // A value longer than the cap could never validate.
    for (const q of QUIZ_QUESTIONS) {
      for (const o of q.options) expect(o.value.length).toBeLessThanOrEqual(64);
    }
  });
});
