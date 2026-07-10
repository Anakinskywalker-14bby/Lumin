import "server-only";

import Stripe from "stripe";

/**
 * Server-only Stripe singleton. `server-only` makes it a build error
 * to import this from any client component, so STRIPE_SECRET_KEY
 * can never reach the browser bundle.
 */
let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeSingleton) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured.");
    stripeSingleton = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
      appInfo: { name: "Lumin Waitlist", version: "1.0.0" },
    });
  }
  return stripeSingleton;
}

export const WAITLIST_FEE_CENTS = 100; // $1.00 USD
