# AI Development Prompt Log — LedgerLine

This document records AI assistance used during development.

## Entry 1 — 2026-11-07

**Task:** Initial backend setup and database configuration.

**Prompt:** Help me build LedgerLine, a secure financial transaction system, step by step using Spring Boot, Java, and PostgreSQL.

**AI output:**
- Guided Spring Boot project setup.
- Explained PostgreSQL configuration.
- Helped configure the database password using the `DB_PASSWORD` environment variable.
- Guided creation of a health check controller.
- Guided Maven build and Git initialization.

**What needed attention:**
- A database password was initially stored directly in local configuration.
- The password was changed and moved to an environment variable.

**Correction:**
- Updated `application.properties` to use `${DB_PASSWORD}`.
- Added `.gitignore` to exclude build output and environment secrets.
- Verified that the Maven build passed.

**Commit:** `9985f0a` — Initial backend setup with health API.

**Security note:** Database credentials must never be committed to Git.

## Entry 2 — 2026-11-08

**Task:** Account creation API and input validation.

**Prompt:** Help me implement account creation in LedgerLine using Spring Boot and PostgreSQL, with proper validation and error handling. Guide me step by step and help me test the API.

**AI output:**
- Guided creation of the Account entity and AccountStatus enum.
- Created the AccountRepository and AccountService.
- Implemented account number generation using SecureRandom.
- Created request and response DTOs.
- Implemented the POST `/api/accounts` endpoint.
- Added input validation and a global exception handler.

**What needed attention:**
- Empty account-holder names needed to be rejected.
- Names longer than 100 characters needed to be rejected.
- Error responses needed to be returned in a consistent JSON format.
- Leading and trailing spaces needed to be removed.

**Correction:**
- Added `@NotBlank` and `@Size(max = 100)` validation.
- Added `GlobalExceptionHandler` for JSON error responses.
- Used `strip()` in the account service to remove surrounding spaces.
- Kept database schema validation enabled with `ddl-auto=validate`.

**Testing:**
- Valid account creation — passed.
- Empty name — HTTP 400, passed.
- Name exceeding 100 characters — HTTP 400, passed.
- Leading and trailing spaces — successfully removed.
- PostgreSQL persistence — verified.

**Commit:** Pending — commit this implementation after the changes are reviewed.

**Security note:** Account creation validation is implemented. Authentication, account ownership checks, and authorization still need to be implemented and tested.