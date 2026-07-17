---
trigger: always_on
---

# Backend Engineering

## Architecture
* Layer separation: Routes (thin) → Services (all business logic) → Repositories (DB only) → Models (data structures).
* Dependency arrow always inward. One service per domain concept.
* Follow the project's established patterns. Don't introduce new ones from blog posts.

## APIs
* Validate every request at controller boundary using schema validation (Zod/Joi/class-validator).
* Consistent responses: `{ success, data, meta }` or `{ success, error: { code, message } }`.
* Correct status codes: 200/201/204 success, 400/401/403/404/409/422/429/500 errors.
* Paginate all list endpoints (default 20-50, max 100). Version APIs: `/api/v1/`.

## Business Logic
* Never duplicate business logic. Extract shared operations into service methods.
* Explicit, testable business rules with descriptive function names.
* Use guard clauses for early returns — avoid deeply nested if-else.

## Database
* Centralize DB access in repositories. Use transactions for atomic operations.
* Watch for N+1 queries — use eager loading or batch queries.
* Optimize queries before adding caching. Use EXPLAIN on complex queries.
* Migrations for all schema changes. Soft-delete critical entities.

## Error Handling
* Custom error classes mapped to HTTP status codes (NotFoundError→404, ValidationError→422).
* Never expose internals to client. Log errors with full context (request ID, user ID, stack trace).
* Structured logging (JSON) in production. Log decisions and failures, not every success.

## Configuration
* All config in environment variables. Validate at startup — fail fast if missing.
* Separate config per environment. Feature flags > commented-out code.