# LedgerLine — Threat Model

## 1. Purpose

LedgerLine handles financial account information and transactions. The system must protect account access, transaction integrity, and audit records.

## 2. Assets to Protect

- User credentials.
- Account information.
- Account balances.
- Transaction records.
- Audit logs.
- Database credentials.

## 3. Potential Threats

| Threat | Potential Impact |
|---|---|
| Unauthorized account access | Account data exposure |
| Duplicate transfer requests | Duplicate financial transactions |
| Concurrent withdrawals | Incorrect or negative balances |
| Unauthorized fund transfer | Financial loss |
| SQL injection | Database compromise |
| Modified transaction history | Loss of financial integrity |
| Exposed database credentials | Unauthorized database access |

## 4. Planned Security Controls

- Password hashing.
- Authentication and role-based authorization.
- Account ownership validation.
- Database transactions.
- Database constraints and locking.
- Idempotency keys for duplicate request protection.
- Immutable double-entry ledger records.
- Audit logging.
- Input validation.
- Environment-based secret management.

## 5. Security Testing Plan

- Test unauthorized account access.
- Test duplicate transaction requests.
- Test withdrawals exceeding available balance.
- Test concurrent withdrawals.
- Test transfer balance conservation.
- Test that users cannot access other users' accounts.

## 6. Current Implementation Status

The initial Spring Boot backend, PostgreSQL connection, and health check endpoint are implemented.

The security controls listed above are planned and must not be considered implemented until their code and tests are completed.