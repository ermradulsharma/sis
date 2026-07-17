---
trigger: always_on
---

# Security Engineering

## Input Validation
* Validate at 3 levels: shape (API boundary), business (service layer), constraints (DB layer).
* Whitelist allowed values, don't blacklist forbidden ones.
* Sanitize all user content before HTML rendering (XSS prevention).
* File uploads: verify MIME + extension, enforce size limits server-side, generate new filenames, never serve from app domain.

## Injection Prevention
* SQL: parameterized queries only. Never string-concatenate user input into queries.
* NoSQL: sanitize query operators (`$gt`, `$ne`, `$regex`) from user input.
* Command: never pass user input to shell commands. Use libraries with proper escaping.

## Auth Security
* Rate-limit auth endpoints (5 login attempts/min, 3 password resets/hour).
* Constant-time comparison for tokens. CSRF protection on all state-changing endpoints.
* Session cookies: HttpOnly, Secure, SameSite=Strict.

## Secrets
* No secrets in source code — env vars or secret managers only.
* Rotate every 90 days minimum. If committed to git, consider it compromised immediately.
* Separate credentials per environment. Never log tokens, passwords, or PII.

## Logging
* Always log: failed auth, authz failures, validation failures, privilege escalations, rate limit hits.
* Never log: passwords, tokens, API keys, credit cards, PII, health data.
* Structured logging with correlation IDs. Right log levels: ERROR/WARN/INFO/DEBUG.

## Security Headers
* Set: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`.

## Least Privilege
* DB accounts: minimum required permissions. API keys: narrowest scope.
* File system: restricted to specific directories. Admin endpoints: separate routes.

## Dependencies
* Audit regularly (`npm audit`, Snyk, Dependabot). Pin versions for reproducible builds.
* Evaluate before adding: maintenance status, license, bundle size, necessity.