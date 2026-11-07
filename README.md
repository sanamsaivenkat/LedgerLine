# LedgerLine

LedgerLine is a secure financial transaction management system designed to maintain accurate account balances and transaction records.

## Project Status

**Current stage:** Initial backend setup completed.

### Implemented
- Spring Boot backend initialized.
- PostgreSQL database connection configured.
- Health check API created.
- Basic backend test passing.

### Planned Features
- User and account management.
- Deposits and withdrawals.
- Secure fund transfers.
- Double-entry transaction ledger.
- Idempotency protection.
- Role-based access control.
- Audit logging.
- Account statements.

## Technology Stack

- Java 21
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Maven
- React (planned)

## Backend Setup

Navigate to:

`backend/ledgerline`

Set your PostgreSQL password in the `DB_PASSWORD` environment variable.

Run the backend:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs at:

`http://localhost:8080`

### Health Check

`GET /api/health`

Expected response:

```json
{
  "application": "LedgerLine",
  "status": "UP"
}
```

## Database Configuration

The database connection uses environment variables for credentials. Never commit database passwords or other secrets.

## Testing

Run:

```powershell
.\mvnw.cmd clean package
```

## Security

Security controls, transaction integrity, authorization, and audit logging will be implemented and tested as development progresses.

## Developer

Sanam Sai Venkat