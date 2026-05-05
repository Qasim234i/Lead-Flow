# LeadFlow CRM - Backend

A lightweight CRM backend built with Node.js, Express, and MongoDB.

## Features

- JWT-based authentication
- Full CRUD for leads
- Notes system linked to leads
- Dashboard metrics API
- Search & filtering
- Input validation
- Error handling

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- cors
- dotenv

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (or edit the existing one):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leadflow
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

3. Seed the database with sample data:
```bash
npm run seed
# or
node seed.js
```

4. Start the server:
```bash
npm start       # production
npm run dev     # development with nodemon
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email & password |

### Leads (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | Get all leads (with filters) |
| GET | `/api/leads/:id` | Get single lead |
| POST | `/api/leads` | Create new lead |
| PUT | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |

**Query Parameters for GET /api/leads:**
- `status` - Filter by status (New, Contacted, Qualified, Proposal Sent, Won, Lost)
- `source` - Filter by source (Website, LinkedIn, Referral, Cold Call, Email, Other)
- `assignedTo` - Filter by assigned person
- `search` - Search by name, company, or email

### Notes (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes/:leadId` | Get notes for a lead |
| POST | `/api/notes` | Add a note |

### Dashboard (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get dashboard metrics |

## Test User

```
Email: admin@example.com
Password: password123
```

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message"
}
```

## License

MIT
