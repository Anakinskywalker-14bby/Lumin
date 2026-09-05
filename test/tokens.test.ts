import { describe, it, expect } from "vitest";
import { generateToken, hashToken, safeEqual } from "@/lib/email";
import { isValidEmail, cn } from "@/lib/utils";
import { faqJsonLd, breadcrumbJsonLd, organizationJsonLd, SITE_URL } from "@/lib/site";

describe("verification tokens", () => {
  it("issues a token and its matching hash", () => {
    const { token, hash } = generateToken();
    expect(hashToken(token)).toBe(hash);
  });

  it("never returns the raw token inside the hash", () => {
    // The DB stores only the hash; if the raw token were recoverable from it,
    // a database leak would let an attacker verify arbitrary accounts.
    const { token, hash } = generateToken();
    expect(hash).not.toContain(token);
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("produces unique tokens across many calls", () => {
    const seen = new Set(Array.from({ length: 500 }, () => generateToken().token));
    expect(seen.size).toBe(500);
  });

  it("uses at least 32 bytes of entropy, URL-safe", () => {
    const { token } = generateToken();
    // base64url of 32 bytes = 43 chars, no padding, no +/ characters.
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it("hashes deterministically", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
    expect(hashToken("abc")).not.toBe(hashToken("abd"));
  });
});

describe("safeEqual", () => {
  it("matches identical strings", () => {
    expect(safeEqual("secret", "secret")).toBe(true);
  });

  it("rejects different strings of equal length", () => {
    expect(safeEqual("secret", "secreT")).toBe(false);
  });

  it("rejects different lengths without throwing", () => {
    // timingSafeEqual throws on length mismatch; the wrapper must guard it.
    expect(() => safeEqual("short", "muchlonger")).not.toThrow();
    expect(safeEqual("short", "muchlonger")).toBe(false);
  });

  it("handles the empty string", () => {
    expect(safeEqual("", "")).toBe(true);
    expect(safeEqual("", "x")).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("accepts ordinary addresses", () => {
    for (const good of [
      "a@b.co",
      "first.last@example.com",
      "user+tag@sub.domain.org",
    ]) {
      expect(isValidEmail(good), good).toBe(true);
    }
  });

  it("rejects malformed addresses", () => {
    for (const bad of [
      "",
      "no-at-sign",
      "@nope.com",
      "trailing@",
      "spaces in@mail.com",
      "two@@at.com",
      "short@tld.c",
    ]) {
      expect(isValidEmail(bad), bad).toBe(false);
    }
  });

  it("rejects non-strings", () => {
    for (const bad of [null, undefined, 42, {}, []]) {
      expect(isValidEmail(bad)).toBe(false);
    }
  });

  it("rejects addresses over the RFC 5321 limit of 254 chars", () => {
    expect(isValidEmail(`${"a".repeat(250)}@b.co`)).toBe(false);
  });
});

describe("cn", () => {
  it("merges conflicting tailwind classes, last one winning", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});

describe("structured data", () => {
  it("builds FAQPage schema with one entity per question", () => {
    const faqs = [
      { q: "Is it free?", a: "Yes." },
      { q: "How?", a: "One photo." },
    ];
    const ld = faqJsonLd(faqs) as {
      "@type": string;
      mainEntity: { name: string; acceptedAnswer: { text: string } }[];
    };
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity).toHaveLength(2);
    expect(ld.mainEntity[0].name).toBe("Is it free?");
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("Yes.");
  });

  it("builds BreadcrumbList with 1-based absolute positions", () => {
    const ld = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]) as { itemListElement: { position: number; item: string }[] };
    expect(ld.itemListElement[0].position).toBe(1);
    expect(ld.itemListElement[1].position).toBe(2);
    expect(ld.itemListElement[1].item).toBe(`${SITE_URL}/about`);
  });

  it("points Organization schema at an absolute https URL", () => {
    expect(organizationJsonLd.url).toMatch(/^https:\/\//);
    expect(organizationJsonLd.logo).toMatch(/^https:\/\//);
  });
});
