# Backend - Patient Management System

**Microservices architecture with Spring Boot 3.5 + Java 21**

## Tech Stack

- **Java 21** | **Spring Boot 3.5.8** | **Maven Multi-module**
- **Spring Cloud Gateway** (API Gateway + JWT validation)
- **Spring Security** (JWT authentication)
- **PostgreSQL** (production) | **H2** (dev/test)
- **gRPC** (Patient → Billing sync communication)
- **Apache Kafka** (Patient → Analytics async events)
- **OpenAPI/Swagger** (API documentation)

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (Port 4004)                     │
│               • Routing  • JWT Validation  • CORS               │
└────────────────┬────────────────────────────────────────────────┘
                 │
    ┌────────────┼────────────────┬─────────────────────┐
    │            │                │                     │
    ▼            ▼                ▼                     ▼
┌────────┐  ┌──────────┐   ┌───────────┐       ┌─────────────┐
│  Auth  │  │ Patient  │   │  Billing  │       │ Analytics   │
│ (4005) │  │  (4000)  │   │  Service  │       │  Service    │
└────────┘  └─────┬────┘   └─────▲─────┘       └──────▲──────┘
                  │                │                    │
                  │    gRPC call   │                    │
                  └────────────────┘                    │
                  │                                     │
                  │     Kafka event: "PatientCreated"  │
                  └─────────────────────────────────────┘
```

## Services

| Service | Port | Purpose | Communication |
|---------|------|---------|---------------|
| **api-gateway** | 4004 | Entry point, routing, JWT validation | HTTP |
| **auth-service** | 4005 | User login, JWT generation | REST API |
| **patient-service** | 4000 | Patient CRUD, business logic | REST + gRPC client + Kafka producer |
| **billing-service** | - | Billing account management | gRPC server |
| **analytics-service** | - | Event processing, analytics | Kafka consumer |

## Patient Creation Flow

```
1. Client → API Gateway: POST /api/patients + JWT
                ↓
2. Gateway: Validate JWT ✓
                ↓
3. Gateway → Patient Service: Forward request
                ↓
4. Patient Service → Billing Service: gRPC CreateBillingAccount()
                ↓
5. Billing Service → Patient Service: billingAccountId
                ↓
6. Patient Service → Database: Save patient
                ↓
7. Patient Service → Kafka: Publish "PatientCreated" event
                ↓
8. Analytics Service: Consume event (async)
                ↓
9. Patient Service → Client: HTTP 201 Created
```

## Quick Start

### Prerequisites

```bash
java --version      # 21+
mvn --version       # 3.8+
psql --version      # PostgreSQL 14+
```

### Database Setup

```sql
CREATE DATABASE patient_db;
CREATE DATABASE auth_db;
CREATE DATABASE billing_db;
CREATE DATABASE analytics_db;
```

### Kafka Setup

```bash
# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Start Kafka
bin/kafka-server-start.sh config/server.properties

# Create topic
bin/kafka-topics.sh --create --topic patient-events \
  --bootstrap-server localhost:9092 --partitions 3
```

### Run Services

```bash
# Build all
mvn clean install -DskipTests

# Start each service (separate terminals)
cd auth-service && mvn spring-boot:run
cd patient-service && mvn spring-boot:run
cd billing-service && mvn spring-boot:run
cd analytics-service && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run  # Start last
```

## API Documentation

- **Auth API**: http://localhost:4004/api-docs/auth
- **Patient API**: http://localhost:4004/api-docs/patients

## Example Requests

```bash
# Login
curl -X POST http://localhost:4004/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Create Patient (with JWT)
curl -X POST http://localhost:4004/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "dateOfBirth": "1990-01-01"
  }'

# Get All Patients
curl http://localhost:4004/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Configuration

Each service has `application.yml` for configuration:

```yaml
# Database (patient-service example)
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/patient_db
    username: pm_user
    password: your_password

# Kafka (patient-service)
spring:
  kafka:
    bootstrap-servers: localhost:9092
    
# JWT (auth-service)
jwt:
  secret: your-secret-key
  expiration: 86400000
```

## Project Structure

```
pm-backend/
├── api-gateway/          # Spring Cloud Gateway
├── auth-service/         # JWT authentication
├── patient-service/      # Core CRUD + gRPC client + Kafka producer
├── billing-service/      # gRPC server
├── analytics-service/    # Kafka consumer
└── integration-tests/    # E2E tests
```

---

**See root README.md for complete project documentation**
