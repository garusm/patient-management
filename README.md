# 🏥 Patient Management System

**Full-stack microservices application for managing patient records**

[🇵🇱 Polski](#-wersja-polska) | [🇬🇧 English](#-english-version)

---

## 🇵🇱 Wersja Polska

### 📖 O Projekcie

System zarządzania pacjentami to kompleksowa aplikacja full-stack zbudowana w architekturze mikroserwisowej. Projekt demonstruje zaawansowane kompetencje w zakresie:
- Projektowania systemów rozproszonych
- Implementacji różnych wzorców komunikacji między serwisami
- Budowania bezpiecznych aplikacji z uwierzytelnianiem
- Tworzenia nowoczesnych interfejsów użytkownika

### 🚀 Stack Technologiczny

#### Backend (pm-backend)
- **Język:** Java 21
- **Framework:** Spring Boot 3.5+
- **API Gateway:** Spring Cloud Gateway
- **Security:** Spring Security + JWT
- **Komunikacja:**
  - **gRPC** - synchroniczna komunikacja wysokiej wydajności (Patient → Billing)
  - **Apache Kafka** - asynchroniczne przetwarzanie zdarzeń (Patient → Analytics)
  - **REST API** - standardowe API HTTP
- **Bazy danych:** PostgreSQL (produkcja), H2 (development/testy)
- **ORM:** Spring Data JPA
- **Dokumentacja API:** OpenAPI 3 / Swagger (SpringDoc)
- **Build:** Maven (multi-module project)

#### Frontend (pm-frontend)
- **Framework:** Next.js 14+ (App Router)
- **UI:** React 18+ (TypeScript)
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Auth:** JWT z localStorage/sessionStorage
- **Design:** Premium dark theme z glassmorphism

### 🏗️ Architektura Systemu

```
┌─────────────┐
│   Frontend  │ (Next.js - Port 3000)
│  (React/TS) │
└──────┬──────┘
       │ HTTP/REST + JWT
       ▼
┌─────────────────────────────────────────┐
│        API Gateway (Port 4004)          │
│  - Routing                              │
│  - JWT Validation                       │
│  - CORS Configuration                   │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴──────────┬────────────────┐
    ▼                    ▼                 ▼
┌──────────┐      ┌─────────────┐   ┌──────────┐
│   Auth   │      │   Patient   │   │ Billing  │
│ Service  │      │   Service   │   │ Service  │
│ (4005)   │      │   (4000)    │   │          │
└──────────┘      └──────┬──────┘   └────▲─────┘
                         │                │
                         │ gRPC call      │
                         └────────────────┘
                         │
                         │ Kafka Event
                         ▼
                  ┌──────────────┐
                  │  Analytics   │
                  │   Service    │
                  └──────────────┘
```

### 📦 Moduły Backendu

1. **api-gateway** (Port: 4004)
   - Punkt wejściowy do systemu
   - Routing żądań do odpowiednich serwisów
   - Walidacja JWT dla chronionych endpointów
   - Konfiguracja CORS

2. **auth-service** (Port: 4005)
   - Rejestracja użytkowników
   - Logowanie (zwraca JWT)
   - Walidacja tokenów

3. **patient-service** (Port: 4000)
   - CRUD pacjentów
   - Integracja z billing-service (gRPC)
   - Publikowanie zdarzeń do Kafka
   - REST API

4. **billing-service**
   - Zarządzanie kontami rozliczeniowymi
   - gRPC server
   - Tworzenie kont dla nowych pacjentów

5. **analytics-service**
   - Konsument zdarzeń z Kafka
   - Analityka i raportowanie
   - Śledzenie rejestracji pacjentów

### 🔄 Przepływ Danych - Przykład (Rejestracja Pacjenta)

```
1. User → API Gateway: POST /auth/login (credentials)
2. API Gateway → Auth Service: forward request
3. Auth Service → User: JWT token

4. User → API Gateway: POST /api/patients + JWT (patient data)
5. API Gateway: Validate JWT ✓
6. API Gateway → Patient Service: forward request
7. Patient Service → Billing Service: gRPC CreateBillingAccount()
8. Billing Service → Patient Service: response (billing account ID)
9. Patient Service → Kafka: publish "PatientCreated" event
10. Analytics Service: consume event from Kafka
11. Patient Service → User: HTTP 201 Created
```

### 📁 Struktura Projektu

```
patient-management-system/
├── pm-backend/
│   ├── api-gateway/           # Spring Cloud Gateway
│   ├── auth-service/          # Authentication & JWT
│   ├── patient-service/       # Core business logic
│   ├── billing-service/       # gRPC server
│   ├── analytics-service/     # Kafka consumer
│   ├── integration-tests/     # End-to-end tests
│   ├── api-requests/          # REST client examples
│   └── grpc-requests/         # gRPC client examples
│
├── pm-frontend/
│   ├── src/
│   │   ├── app/               # Next.js pages (App Router)
│   │   ├── components/        # React components
│   │   ├── context/           # Auth context
│   │   ├── lib/               # API client
│   │   └── types/             # TypeScript definitions
│   └── public/                # Static assets
│
└── README.md                  # Ten plik
```

### 🛠️ Wymagania

- **Java:** 21+
- **Node.js:** 18+
- **PostgreSQL:** 14+
- **Apache Kafka:** 3.0+
- **Maven:** 3.8+
- **npm/pnpm:** Latest

### 🚀 Uruchomienie Projektu

#### 1. Backend

```bash
cd pm-backend

# Uruchom każdy serwis (w osobnych terminalach)
cd auth-service && mvn spring-boot:run
cd patient-service && mvn spring-boot:run
cd billing-service && mvn spring-boot:run
cd analytics-service && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run
```

**Uwaga:** Wymagane są uruchomione instancje PostgreSQL i Kafka.

#### 2. Frontend

```bash
cd pm-frontend

# Zainstaluj zależności
npm install

# Utwórz plik .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:4004" > .env.local

# Uruchom development server
npm run dev
```

Aplikacja będzie dostępna pod adresem: **http://localhost:3000**

### 📝 API Documentation

Po uruchomieniu API Gateway, dokumentacja Swagger dostępna jest pod:

- **Auth Service:** http://localhost:4004/api-docs/auth
- **Patient Service:** http://localhost:4004/api-docs/patients

### 🎯 Cechy Projektu (dla Rekruterów)

#### Wzorce Architektoniczne
- ✅ **Microservices Architecture**
- ✅ **API Gateway Pattern**
- ✅ **Event-Driven Architecture** (Kafka)
- ✅ **Synchronous RPC** (gRPC)
- ✅ **RESTful API Design**

#### Security
- ✅ **JWT Authentication**
- ✅ **Token-based Authorization**
- ✅ **CORS Configuration**
- ✅ **Protected Routes** (Frontend & Backend)

#### Best Practices
- ✅ **Multi-module Maven Project**
- ✅ **OpenAPI Documentation**
- ✅ **TypeScript** dla type safety
- ✅ **React Context** do zarządzania stanem
- ✅ **Component-based UI**
- ✅ **Responsive Design**

#### Technologie Komunikacji
- ✅ **REST API** - standard HTTP
- ✅ **gRPC** - wysoka wydajność, type-safe
- ✅ **Kafka** - event streaming, asynchroniczność

### 📊 Przykładowe Use Cases

1. **Rejestracja i Logowanie**
   - User rejestruje się → Auth Service
   - User loguje się → otrzymuje JWT
   - JWT jest używany we wszystkich request'ach

2. **Zarządzanie Pacjentami**
   - CRUD operations (Create, Read, Update, Delete)
   - Lista wszystkich pacjentów z filtrowaniem
   - Szczegóły pojedynczego pacjenta

3. **Automatyczne Rozliczenia**
   - Tworzenie pacjenta → automatyczne utworzenie konta billing
   - Komunikacja Patient Service ↔ Billing Service przez gRPC

4. **Analityka w Czasie Rzeczywistym**
   - Każda rejestracja pacjenta → event w Kafka
   - Analytics Service konsumuje i przetwarza
   - Dashboard ze statystykami



## English Version

### 📖 About the Project

Patient Management System is a comprehensive full-stack application built with microservices architecture. The project demonstrates advanced competencies in:
- Distributed systems design
- Implementation of various inter-service communication patterns
- Building secure applications with authentication
- Creating modern user interfaces

### 🚀 Technology Stack

#### Backend (pm-backend)
- **Language:** Java 21
- **Framework:** Spring Boot 3.5+
- **API Gateway:** Spring Cloud Gateway
- **Security:** Spring Security + JWT
- **Communication:**
  - **gRPC** - synchronous high-performance communication (Patient → Billing)
  - **Apache Kafka** - asynchronous event processing (Patient → Analytics)
  - **REST API** - standard HTTP API
- **Databases:** PostgreSQL (production), H2 (development/testing)
- **ORM:** Spring Data JPA
- **API Documentation:** OpenAPI 3 / Swagger (SpringDoc)
- **Build:** Maven (multi-module project)

#### Frontend (pm-frontend)
- **Framework:** Next.js 14+ (App Router)
- **UI:** React 18+ (TypeScript)
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Auth:** JWT with localStorage/sessionStorage
- **Design:** Premium dark theme with glassmorphism

### 🏗️ System Architecture

```
┌─────────────┐
│   Frontend  │ (Next.js - Port 3000)
│  (React/TS) │
└──────┬──────┘
       │ HTTP/REST + JWT
       ▼
┌─────────────────────────────────────────┐
│        API Gateway (Port 4004)          │
│  - Routing                              │
│  - JWT Validation                       │
│  - CORS Configuration                   │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴──────────┬────────────────┐
    ▼                    ▼                 ▼
┌──────────┐      ┌─────────────┐   ┌──────────┐
│   Auth   │      │   Patient   │   │ Billing  │
│ Service  │      │   Service   │   │ Service  │
│ (4005)   │      │   (4000)    │   │          │
└──────────┘      └──────┬──────┘   └────▲─────┘
                         │                │
                         │ gRPC call      │
                         └────────────────┘
                         │
                         │ Kafka Event
                         ▼
                  ┌──────────────┐
                  │  Analytics   │
                  │   Service    │
                  └──────────────┘
```

### 📦 Backend Modules

1. **api-gateway** (Port: 4004)
   - System entry point
   - Request routing to appropriate services
   - JWT validation for protected endpoints
   - CORS configuration

2. **auth-service** (Port: 4005)
   - User registration
   - Login (returns JWT)
   - Token validation

3. **patient-service** (Port: 4000)
   - Patient CRUD operations
   - Integration with billing-service (gRPC)
   - Publishing events to Kafka
   - REST API

4. **billing-service**
   - Billing account management
   - gRPC server
   - Creating accounts for new patients

5. **analytics-service**
   - Kafka event consumer
   - Analytics and reporting
   - Patient registration tracking

### 🔄 Data Flow - Example (Patient Registration)

```
1. User → API Gateway: POST /auth/login (credentials)
2. API Gateway → Auth Service: forward request
3. Auth Service → User: JWT token

4. User → API Gateway: POST /api/patients + JWT (patient data)
5. API Gateway: Validate JWT ✓
6. API Gateway → Patient Service: forward request
7. Patient Service → Billing Service: gRPC CreateBillingAccount()
8. Billing Service → Patient Service: response (billing account ID)
9. Patient Service → Kafka: publish "PatientCreated" event
10. Analytics Service: consume event from Kafka
11. Patient Service → User: HTTP 201 Created
```

### 📁 Project Structure

```
patient-management-system/
├── pm-backend/
│   ├── api-gateway/           # Spring Cloud Gateway
│   ├── auth-service/          # Authentication & JWT
│   ├── patient-service/       # Core business logic
│   ├── billing-service/       # gRPC server
│   ├── analytics-service/     # Kafka consumer
│   ├── integration-tests/     # End-to-end tests
│   ├── api-requests/          # REST client examples
│   └── grpc-requests/         # gRPC client examples
│
├── pm-frontend/
│   ├── src/
│   │   ├── app/               # Next.js pages (App Router)
│   │   ├── components/        # React components
│   │   ├── context/           # Auth context
│   │   ├── lib/               # API client
│   │   └── types/             # TypeScript definitions
│   └── public/                # Static assets
│
└── README.md                  # This file
```

### 🛠️ Requirements

- **Java:** 21+
- **Node.js:** 18+
- **PostgreSQL:** 14+
- **Apache Kafka:** 3.0+
- **Maven:** 3.8+
- **npm/pnpm:** Latest

### 🚀 Running the Project

#### 1. Backend

```bash
cd pm-backend

# Run each service (in separate terminals)
cd auth-service && mvn spring-boot:run
cd patient-service && mvn spring-boot:run
cd billing-service && mvn spring-boot:run
cd analytics-service && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run
```

**Note:** Running PostgreSQL and Kafka instances are required.

#### 2. Frontend

```bash
cd pm-frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:4004" > .env.local

# Run development server
npm run dev
```

Application will be available at: **http://localhost:3000**

### 📝 API Documentation

After starting the API Gateway, Swagger documentation is available at:

- **Auth Service:** http://localhost:4004/api-docs/auth
- **Patient Service:** http://localhost:4004/api-docs/patients

### 🎯 Project Features (for Recruiters)

#### Architectural Patterns
- ✅ **Microservices Architecture**
- ✅ **API Gateway Pattern**
- ✅ **Event-Driven Architecture** (Kafka)
- ✅ **Synchronous RPC** (gRPC)
- ✅ **RESTful API Design**

#### Security
- ✅ **JWT Authentication**
- ✅ **Token-based Authorization**
- ✅ **CORS Configuration**
- ✅ **Protected Routes** (Frontend & Backend)

#### Best Practices
- ✅ **Multi-module Maven Project**
- ✅ **OpenAPI Documentation**
- ✅ **TypeScript** for type safety
- ✅ **React Context** for state management
- ✅ **Component-based UI**
- ✅ **Responsive Design**

#### Communication Technologies
- ✅ **REST API** - standard HTTP
- ✅ **gRPC** - high performance, type-safe
- ✅ **Kafka** - event streaming, asynchronous

### 📊 Example Use Cases

1. **Registration and Login**
   - User registers → Auth Service
   - User logs in → receives JWT
   - JWT is used in all requests

2. **Patient Management**
   - CRUD operations (Create, Read, Update, Delete)
   - List all patients with filtering
   - Individual patient details

3. **Automatic Billing**
   - Creating patient → automatic billing account creation
   - Patient Service ↔ Billing Service communication via gRPC

4. **Real-time Analytics**
   - Each patient registration → event in Kafka
   - Analytics Service consumes and processes
   - Dashboard with statistics



## 🙏 Acknowledgments

Built with modern technologies and best practices for microservices architecture.
