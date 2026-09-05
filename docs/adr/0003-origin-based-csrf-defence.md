# ADR 0003 — CSRF defence by request-host comparison, not a token round-trip

- **Status:** Accepted
- **Date:** 2026-09-05
- **Amends:** the original SITE_URL allow-list, which caused a production outage

## Context

Both mutating endpoints are same-origin JSON `POST`s from our own pages. The
classic CSRF attack — a form on `evil.com` auto-submitting to our endpoint —
is what we need to stop.

A synchroniser token would require issuing, storing and rotating per-session
state on a site that deliberately has no sessions (see ADR 0001).

## Decision

`assertSameOrigin()` rejects any state-changing request whose `Origin` (or
`Referer`, when privacy tooling strips `Origin`) does not match the host the
request was actually addressed to. Missing both headers fails closed.

The comparison is against **the request's own host** — `x-forwarded-host`,
then `host` — plus `SITE_URL` and Vercel's environment-provided hostnames.

## Consequences

**Good**

- No server-side session state, no token to leak or rotate.
- Works on every Vercel alias, every preview deployment, and any custom domain
  added later, with zero configuration.
- A cross-site request still carries the attacker's `Origin` while `Host`
  remains ours, so the mismatch blocks it — the security property is intact.

**Bad / accepted trade-offs**

- A client that sends neither `Origin` nor `Referer` is blocked. Every current
  browser sends `Origin` on cross-origin and same-origin POSTs, so this only
  affects scripted clients, which are not a supported path.
- `Host` is attacker-*influenced* in principle. It is not attacker-*controlled*
  in practice: the request must still be routed to us by that host, and it must
  match the `Origin` for the request to pass.

## Incident that prompted the amendment

The first implementation allow-listed `SITE_URL` (`lumin-pink.vercel.app`) and
`VERCEL_URL`. But `VERCEL_URL` holds the immutable per-deployment hostname, not
the branch alias that visitors actually use. Anyone signing up on the live URL
sent an `Origin` matching neither entry and got **"Invalid request origin."** —
a total signup outage that looked like a client bug.

Lesson recorded here deliberately: an allow-list of environment-derived
hostnames is a standing outage risk on a platform that serves one app from many
hostnames. Comparing against the request's own host has no such failure mode.
A regression test in `test/security.test.ts` now covers the alias case.
