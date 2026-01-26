# Frontend - Patient Management System

**Next.js 14 App Router + React 18 + TypeScript**

## Tech Stack

- **Next.js 14+** (App Router) | **React 18** | **TypeScript**
- **Tailwind CSS** (styling)
- **React Context API** (auth state)
- **JWT Authentication** (localStorage persistence)
- **Axios** (API client)

## Features

- 🔐 JWT-based authentication
- 👥 Patient CRUD operations
- 📊 Dashboard with statistics
- 🎨 Premium dark theme + glassmorphism
- 📱 Fully responsive design

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Port 3000)                 │
│                                                         │
│  ┌────────────┐   ┌──────────────┐   ┌──────────────┐ │
│  │   Login    │   │  Dashboard   │   │  Patients    │ │
│  │   Page     │   │    Page      │   │    Page      │ │
│  └─────┬──────┘   └──────┬───────┘   └──────┬───────┘ │
│        │                 │                   │         │
│        └─────────────────┼───────────────────┘         │
│                          │                             │
│              ┌───────────▼──────────┐                  │
│              │   AuthContext        │                  │
│              │  • isAuthenticated   │                  │
│              │  • login/logout      │                  │
│              │  • JWT management    │                  │
│              └───────────┬──────────┘                  │
│                          │                             │
│              ┌───────────▼──────────┐                  │
│              │    API Client        │                  │
│              │  • Axios wrapper     │                  │
│              │  • JWT headers       │                  │
│              └───────────┬──────────┘                  │
└──────────────────────────┼──────────────────────────────┘
                           │ HTTP + JWT
                           ▼
              ┌────────────────────────┐
              │   API Gateway (4004)   │
              │      Backend           │
              └────────────────────────┘
```

## Authentication Flow

```
1. User enters credentials on /login
                ↓
2. Frontend → Backend: POST /auth/login
                ↓
3. Backend validates credentials
                ↓
4. Backend → Frontend: { token: "JWT...", expiresIn: 86400000 }
                ↓
5. Frontend stores JWT in localStorage
                ↓
6. AuthContext updates isAuthenticated = true
                ↓
7. Redirect to /dashboard
                ↓
8. All subsequent requests include:
   Header: "Authorization: Bearer {JWT}"
```

## Protected Routes

```
┌──────────────────────────────────────────────────┐
│  User accesses /patients                         │
│              ↓                                    │
│  AuthContext checks isAuthenticated              │
│              ↓                                    │
│  ✓ Authenticated → Show patients page            │
│  ✗ Not authenticated → Redirect to /login        │
└──────────────────────────────────────────────────┘
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home (redirect to login)
│   ├── login/page.tsx       # Login page
│   ├── dashboard/page.tsx   # Dashboard
│   └── patients/page.tsx    # Patients CRUD
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx      # Navigation
│   │   └── Header.tsx       # Page header
│   ├── patients/
│   │   └── PatientForm.tsx  # Create/Edit form
│   └── ui/
│       ├── Button.tsx       # Custom button
│       ├── Card.tsx         # Card container
│       ├── Input.tsx        # Form input
│       └── Modal.tsx        # Modal dialog
│
├── context/
│   └── AuthContext.tsx      # Auth state management
│
├── lib/
│   └── api.ts               # API client (Axios)
│
└── types/
    └── index.ts             # TypeScript types
```

## Quick Start

### Prerequisites

```bash
node --version  # 18+
npm --version
```

### Installation

```bash
cd pm-frontend
npm install
```

### Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4004
```

### Run Development Server

```bash
npm run dev
# → http://localhost:3000
```

### Default Login

```
Email: admin@example.com
Password: admin123
```

## API Integration

### Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/login` | POST | ❌ | Login, get JWT |
| `/api/patients` | GET | ✅ | List patients |
| `/api/patients` | POST | ✅ | Create patient |
| `/api/patients/{id}` | PUT | ✅ | Update patient |
| `/api/patients/{id}` | DELETE | ✅ | Delete patient |

### API Client Usage

```typescript
import api from '@/lib/api';

// Login
const { token } = await api.login(email, password);

// Get patients
const patients = await api.getPatients();

// Create patient
await api.createPatient({
  name: "John Doe",
  email: "john@example.com",
  address: "123 Main St",
  dateOfBirth: "1990-01-01"
});
```

## Design System

### Colors

```css
Background:  #0f172a (slate-900)
Secondary:   #1e293b (slate-800)
Accent:      Blue (#3b82f6) → Purple (#a855f7) gradient
Text:        #ffffff (white), #cbd5e1 (slate-300)
```

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: Bold, semibold
- **Body**: Regular (16px)

### Components

```tsx
<Button>Action</Button>
<Card><CardContent>Content</CardContent></Card>
<Input placeholder="Enter text" />
<Modal isOpen={true}>Modal content</Modal>
```

## Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel
```

## Troubleshooting

**CORS Error**: Check backend CORS config in `api-gateway/application.yml`

**Auth Loop**: Clear localStorage → `localStorage.clear()`

**API Error**: Verify backend is running on port 4004

---

**See root README.md for complete project documentation**
