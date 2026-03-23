# 🚀 Mini Compliance Tracker

A simple full-stack web application to manage compliance tasks for multiple clients.

Built using **Next.js (App Router)** and **Supabase**.

---

## 🌐 Live Demo

👉 https://your-app.vercel.app

---

## 📦 GitHub Repository

👉 https://github.com/your-username/your-repo

---

## ✨ Features

### 👥 Clients

* View list of clients
* Add new clients
* Select a client to view tasks

### 📋 Tasks

* View tasks for selected client
* Add new tasks
* Update task status (Pending → Completed)
* Filter tasks by status
* Highlight **overdue tasks**

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Backend:** Next.js API Routes
* **Database:** Supabase (PostgreSQL)
* **Deployment:** Vercel

---

## 🗄️ Database Schema (Supabase)

### 📌 Clients Table

| Column       | Type      |
| ------------ | --------- |
| id           | uuid (PK) |
| company_name | text      |
| country      | text      |
| entity_type  | text      |

---

### 📌 Tasks Table

| Column      | Type                     |
| ----------- | ------------------------ |
| id          | uuid (PK)                |
| client_id   | uuid (FK)                |
| title       | text                     |
| description | text                     |
| category    | text                     |
| due_date    | date                     |
| status      | text (pending/completed) |
| priority    | text                     |

---

## 📁 Folder Structure

```
app/
 ├── api/
 │   ├── clients/
 │   │   └── route.ts        # GET + POST clients
 │   ├── tasks/
 │   │   ├── route.ts        # POST task
 │   │   ├── update/
 │   │   │   └── route.ts    # PATCH task status
 │   │   └── [clientId]/
 │   │       └── route.ts    # GET tasks by client
 │
 ├── page.tsx                # Main UI

lib/
 └── supabaseClient.ts       # Supabase client setup

public/
styles/
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

### 2️⃣ Install Dependencies

```bash
npm install --legacy-peer-deps
```

---

### 3️⃣ Setup Environment Variables

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### 4️⃣ Setup Database (Supabase)

Run the following SQL in Supabase SQL Editor:

```sql
create table clients (
  id uuid primary key default uuid_generate_v4(),
  company_name text,
  country text,
  entity_type text
);

create table tasks (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete cascade,
  title text,
  description text,
  category text,
  due_date date,
  status text default 'pending',
  priority text
);
```

---

### 5️⃣ Run the App

```bash
npm run dev
```

---

## 🚀 Deployment

The app is deployed using **Vercel**.

Steps:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

---

## ⚖️ Tradeoffs

* Used Next.js API routes instead of a separate backend for simplicity
* No authentication to reduce complexity
* Minimal UI design to focus on functionality
* Basic validation only

---

## 📌 Assumptions

* Tasks belong to one client
* Status is either `pending` or `completed`
* Overdue tasks = pending tasks with past due date
* No user roles or permissions

---

## 🔮 Future Improvements

* Add authentication (Supabase Auth)
* Add search and sorting
* Add dashboard stats (pending / overdue)
* Improve UI/UX design
* Add pagination for large datasets

---

## 👨‍💻 Author

Tejas Yogesh
