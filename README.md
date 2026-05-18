# Employee Performance Analytics & Recommendation System

**Student:** Arnav Bhardwaj  
**Enrollment:** 202401100300062  
**Course:** ESE — Full Stack Development

AI-powered MERN stack application for employee performance tracking, analytics, and AI-based recommendations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt |
| AI | OpenRouter API (LLaMA 3.1) |

---

## Project Structure

```
ESE_202401100300062_Employee_Performance/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Employee.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── aiRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Setup & Installation

### 1. Clone Repository
```bash
git clone <repo-url>
cd ESE_202401100300062_Employee_Performance
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI in .env
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/me` | Get current user |

### Employees (Protected)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/employees` | Add employee |
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/search?department=Dev` | Search employees |
| GET | `/api/employees/:id` | Get single employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### AI (Protected)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/recommend` | Get AI recommendations |

---

## Features

- JWT Authentication with bcrypt password hashing
- Full CRUD for employee management
- Search & filter by name, department, score range
- AI-powered promotion & training recommendations
- Beautiful responsive UI with Tailwind CSS
- Real-time performance score visualization
