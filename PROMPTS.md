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