# LedgerLine

LedgerLine is a secure financial transaction management system built to manage user accounts, maintain accurate account balances, and record financial transactions with proper authorization and audit tracking.

## Project Status

**Current Stage:** Backend development – Core features implemented.

### Implemented Features

- User registration and login.
- Password hashing using BCrypt.
- JWT-based authentication.
- PostgreSQL database integration.
- Secure account creation and management.
- Account ownership validation.
- Deposit and withdrawal operations.
- Transaction history.
- Audit logging for account creation, deposits, and withdrawals.
- Transaction amount validation.
- Insufficient balance protection.
- Account-level transaction locking.
- Unit and application tests.

### Planned Features

- Secure fund transfers between accounts.
- Double-entry transaction ledger.
- Idempotency protection.
- Role-based authorization.
- Account statements and reporting.
- React frontend.

## Technology Stack

| Technology | Purpose |
|---|---|
| Java 21 | Backend programming |
| Spring Boot | Backend framework |
| Spring Security | Authentication and security |
| Spring Data JPA | Database operations |
| PostgreSQL | Relational database |
| JWT | Token-based authentication |
| BCrypt | Password hashing |
| Maven | Build and dependency management |
| React | Frontend (planned) |

## Project Structure

```text
LedgerLine/
└── backend/
    └── ledgerline/
        ├── src/
        │   ├── main/
        │   │   ├── java/
        │   │   │   └── com/ledgerline/ledgerline/
        │   │   └── resources/
        │   └── test/
        └── pom.xml
```

## Backend Setup

### Prerequisites

- Java 21
- PostgreSQL
- Maven

### 1. Clone the Repository

```bash
git clone https://github.com/sanamsaivenkat/LedgerLine.git
cd LedgerLine
```

### 2. Navigate to the Backend

```powershell
cd backend/ledgerline
```

### 3. Configure Environment Variables

Set your PostgreSQL password and JWT secret before starting the application.

PowerShell:

```powershell
$env:DB_PASSWORD="your_database_password"
$env:JWT_SECRET="your_long_random_jwt_secret"
```

Use a strong JWT secret compatible with the configured signing algorithm. Never commit real credentials or secrets to GitHub.

### 4. Configure PostgreSQL

Create a PostgreSQL database named:

```sql
CREATE DATABASE ledgerline_db;
```

Configure the database connection in `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/ledgerline_db
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
security.jwt.secret=${JWT_SECRET}
```

Ensure the database schema matches the application's JPA entities before starting the application. The current configuration uses `ddl-auto=validate`, so Hibernate validates the schema rather than creating or updating tables automatically.

### 5. Run the Application

```powershell
mvn spring-boot:run
```

The backend runs at:

```text
http://localhost:8080
```

## API Overview

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/api/health` | Check application health | Public |
| POST | `/api/auth/register` | Register a user | Public |
| POST | `/api/auth/login` | Authenticate a user | Public |
| Account APIs | Implemented | Create and manage accounts | Authenticated |
| Transaction APIs | Implemented | Deposit, withdraw, and view transaction history | Authenticated |

Authenticated requests use a JWT access token.

## Security

LedgerLine implements several security and transaction-integrity controls:

- BCrypt password hashing.
- Stateless JWT authentication.
- Protected account and transaction APIs.
- Account ownership verification to prevent unauthorized access.
- Pessimistic database locking for transaction operations.
- Optimistic locking for account updates.
- Transaction amount validation.
- Audit records for account creation, deposits, and withdrawals.

## Testing

Run the complete backend test suite:

```powershell
mvn clean test
```

Build the application:

```powershell
mvn clean package
```

**Latest test results:**

- Total tests: 16
- Failures: 0
- Errors: 0
- Skipped: 0

**Build Status:** SUCCESS

## Future Improvements

- Implement account-to-account fund transfers.
- Introduce a double-entry ledger.
- Add idempotency protection for transaction requests.
- Implement role-based authorization.
- Generate downloadable account statements.
- Develop a React-based user interface.

## Developer

**Sanam Sai Venkat**

GitHub: https://github.com/sanamsaivenkat

