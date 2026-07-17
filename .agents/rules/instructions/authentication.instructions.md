---
trigger: always_on
---

# Authentication & Authorization

## Authentication
* Authenticate every protected request via middleware. Never trust client-side auth state.
* Use industry-standard tokens (JWT, session-based, OAuth). Never roll your own.
* Access tokens: short-lived (15-30 min). Refresh tokens: rotated on use. Session cookies: HttpOnly, Secure, SameSite.
* Hash passwords with bcrypt (cost ≥ 12) or argon2. Never MD5/SHA-256.
* Rate-limit login attempts. Implement lockout or exponential backoff.
* On logout, invalidate server-side. Deleting client cookie is not enough.
* Never put tokens/credentials in URLs or query strings.

## Authorization
* Authorize every sensitive action. Auth ≠ Authz — verify both.
* Check permissions at service layer, not just route level. Default to deny.
* Protect against IDOR: always verify resource ownership (`GET /orders/456` — does this user own order 456?).
* Validate permissions before DB operations, not after fetching data.

## Secrets
* Store in env vars or secret managers. Never in source code or committed configs.
* Rotate regularly. Separate credentials per environment (dev/staging/prod).
* Never log tokens, passwords, API keys, or session IDs.

## Sessions
* Regenerate session IDs after login or privilege escalation.
* Set aggressive but usable timeouts (~30 min inactivity).
* Store session data server-side. Client-side session storage invites tampering.