# 🐞 Bug Tracker Backend

A **full-featured backend** for a bug tracking system built with **Node.js, Express, TypeScript, Prisma, and PostgreSQL**.  
It supports **projects, members, issues, labels, comments, role-based access control, and JWT authentication** — perfect for portfolio demonstration.

---

## ⚡ Features

- **Authentication & Authorization**
  - JWT-based login
  - Role-based access: `ADMIN`, `USER`
  - Project roles: `OWNER`, `MAINTAINER`, `CONTRIBUTOR`, `VIEWER`
- **Projects**
  - Create, update, delete, list
  - Assign members with roles
- **Issues**
  - Create, assign, update, delete
  - Status (`OPEN`, `IN_PROGRESS`, `CLOSED`) and priority (`LOW`, `MEDIUM`, `HIGH`)
- **Labels**
  - Create, assign, detach, update, delete
- **Comments**
  - Add, list, and delete comments on issues
- **Validation & Security**
  - Zod schema validation for requests
  - Role & ownership-based access control
  - Password hashing with bcrypt

---

## 🗂 Tech Stack

- **Backend:** Node.js, Express, TypeScript  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Auth:** JWT, bcrypt  
- **Validation:** Zod  
- **Logging & Utilities:** morgan, cors, dotenv  

---

## 🏗 Project Structure

bug-tracker-backend/
│
├─ prisma/ # Prisma schema & migration files
│ └─ schema.prisma
├─ bugs/
│ ├─ bug.controller.ts # Project, Issue, Label, Comment controllers
│ └─ bug.service.ts # Project, Issue, Label, Comment services
├─ routes/
│ ├─ auth.route.ts
│ ├─ project.route.ts
│ ├─ issue.route.ts
│ ├─ label.route.ts
│ └─ comment.route.ts
├─ middlewares/
│ └─ auth.middleware.ts
├─ prisma/
│ └─ client.ts # Prisma Client
├─ utils/
│ └─ jwt.ts # JWT utilities
├─ server.ts # Server entry point
└─ app.ts # Express app configuration


---

## ⚙️ Getting Started

### 1. Clone & Install
```bash
git clone <repo-url>
cd bug-tracker-backend
npm install
2. Setup Environment Variables
Create .env file in root:

DATABASE_URL="postgresql://<user>:<password>@localhost:5432/bug_tracker"
JWT_SECRET="your_jwt_secret"
PORT=4000
3. Run Prisma Migrations
npx prisma migrate dev --name init
npx prisma generate
4. Start Server
npm run dev
Server will run at http://localhost:4000.

🚀 API Endpoints
Authentication
POST /auth/register – Register user

POST /auth/login – Login

GET /auth/me – Get current user

Projects
POST /projects – Create project

GET /projects – List projects

GET /projects/:id – Get project

PATCH /projects/:id – Update project

DELETE /projects/:id – Delete project

Members
POST /projects/:id/members – Add member

PATCH /projects/:id/members/:memberId – Update member role

DELETE /projects/:id/members/:memberId – Remove member

GET /projects/:id/members – List members

Issues
POST /projects/:id/issues – Create issue

GET /projects/:id/issues – List issues

GET /issues/:id – Get issue

PATCH /issues/:id – Update issue

PATCH /issues/:id/assign – Assign issue

PATCH /issues/:id/status – Update status

DELETE /issues/:id – Delete issue

Labels
POST /labels – Create label

GET /labels – List labels

PATCH /labels/:id – Update label

DELETE /labels/:id – Delete label

POST /issues/:id/labels – Attach label

DELETE /issues/:id/labels/:labelId – Detach label

Comments
POST /issues/:id/comments – Add comment

GET /issues/:id/comments – List comments

DELETE /comments/:id – Delete comment

All protected routes require Authorization: Bearer <JWT> header.

👥 Roles & Permissions
Entity	Action	Who Can Do
Project	Create	Any authenticated user
Project	Update/Delete	OWNER / MAINTAINER
Member	Add/Update/Remove	OWNER / MAINTAINER
Issue	Create	Project members
Issue	Assign/Status Update	OWNER / MAINTAINER / Assignee
Label	Create/Update/Delete	ADMIN / OWNER / MAINTAINER
Comment	Create	Any authenticated user
Comment	Delete	Author / OWNER / MAINTAINER