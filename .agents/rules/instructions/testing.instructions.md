---
trigger: always_on
---

# Testing & Verification

## Mindset
* Testing is not optional. Every change must be verified before completion.
* Test behavior, not implementation. Think like an attacker: empty input, huge input, missing auth, double submit, wrong user ID.
* Every bug fix gets a test. If it broke once without a test, it will break again.

## Testing Pyramid
* **Unit tests**: Individual functions/services in isolation. Mock externals. Cover happy path, edge cases, errors.
* **Integration tests**: Components working together (service+DB, endpoint+auth). Use test DB with seed data.
* **E2E tests**: Critical user journeys only (login→action→result). Strategic, not comprehensive — they're slow and brittle.

## Test Quality
* One test = one assertion topic. Descriptive names: `returns 404 when user does not exist`.
* Arrange → Act → Assert. No test interdependence. Don't test framework code.
* Avoid: flaky tests, implementation-detail tests, tests without assertions, copy-pasted tests.

## Verification Checklist
* **Functional**: Happy path works. Edge cases handled. Errors return proper codes (not 500 for bad input). Existing tests still pass.
* **API**: Correct status codes. Response shape matches contract. Auth returns 401/403 correctly.
* **Frontend**: Works on mobile/tablet/desktop. Loading/error/empty states present. No console errors. Forms handle all states.
* **Security**: Auth/authz tested with valid and invalid credentials. Input validation rejects malicious input. No sensitive data in responses/logs.

## Reporting
* Communicate: what was tested, how, what passed, what wasn't tested (be honest), and any risks.