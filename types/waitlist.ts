/** Shared shape of the configurator payload persisted to waitlist.configuration */
export interface RitualConfiguration {
  skinType: string;
  concerns: string[];
  infusions: string[];
  hydration: number; // 0–100
  radiance: number; // 0–100
  toneDepth: number; // 0–100
}

export const SKIN_TYPES = ["Dry", "Oily", "Combination", "Sensitive", "Balanced"] as const;

export const CONCERNS = [
  "Anti-aging",
  "Dark Spots",
  "Redness",
  "Texture",
  "Dullness",
  "Breakouts",
] as const;

export const INFUSIONS = [
  "Sea Buckthorn",
  "Matcha Catechin",
  "Turmeric CO2",
  "Blueberry Ferment",
  "Oat Beta-Glucan",
  "Cacao Flavanol",
] as const;
