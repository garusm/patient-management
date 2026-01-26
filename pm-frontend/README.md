# Patient Management Frontend

Modern React/Next.js frontend for the Patient Management microservices backend.

## 🚀 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **UI Library:** React 18+
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API

## 📋 Features

- 🔐 JWT Authentication (Login/Logout)
- 📊 Dashboard with patient statistics
- 👥 Patient CRUD operations (Create, Read, Update, Delete)
- 🎨 Premium dark theme with glassmorphism design
- 📱 Fully responsive (mobile, tablet, desktop)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- Running backend services (API Gateway on port 4004)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4004
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard page
│   ├── login/              # Login page
│   └── patients/           # Patients list & CRUD
├── components/
│   ├── layout/             # Sidebar, Header
│   ├── patients/           # Patient-specific components
│   └── ui/                 # Reusable UI components
├── context/                # React Context providers
├── lib/                    # API client, utilities
└── types/                  # TypeScript definitions
```

## 🔗 API Integration

The frontend connects to the backend via API Gateway (port 4004):

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | User authentication |
| `/patients` | GET | List all patients |
| `/patients` | POST | Create patient |
| `/patients/{id}` | PUT | Update patient |
| `/patients/{id}` | DELETE | Delete patient |

## 🎨 Design System

- **Colors:** Blue/Purple gradient accents on dark slate background
- **Effects:** Glassmorphism cards, subtle animations
- **Typography:** Inter font family
