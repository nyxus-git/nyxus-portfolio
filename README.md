# Rohan Mane - Portfolio

A modern portfolio website built with Next.js, Tailwind CSS, and Framer Motion, now powered by a custom FastAPI + MongoDB content backend.

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS, Framer Motion
- Backend: FastAPI
- Database: MongoDB Atlas
- Admin CMS: Built-in `/admin` dashboard
- AI: Grok API (server-side)

## Setup

### 1. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

Run:

```bash
npm run dev
```

### 2. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
MONGODB_DB_NAME=nyxus_portfolio
ADMIN_USERNAME=nyxus
ADMIN_PASSWORD=nyxus123
ADMIN_TOKEN=optional_token_for_scripts
XAI_API_KEY=your_grok_api_key
XAI_BASE_URL=https://api.x.ai/v1
XAI_MODEL=grok-3-mini
```

Run:

```bash
uvicorn app.main:app --reload
```

## Admin Dashboard

Open `http://localhost:3000/admin` and use `ADMIN_TOKEN` to perform CRUD for:
Open `http://localhost:3000/admin` and login with `ADMIN_USERNAME` and `ADMIN_PASSWORD` from `backend/.env` to perform CRUD for:

- Projects
- Experiences
- Certifications
- Blogs

## One-time Migration from Contentful

If your current content still lives in Contentful, migrate it once into MongoDB:

```bash
cd frontend
CONTENTFUL_SPACE_ID=your_space_id \
CONTENTFUL_ACCESS_TOKEN=your_access_token \
API_BASE_URL=http://localhost:8000/api \
ADMIN_USERNAME=nyxus \
ADMIN_PASSWORD=nyxus123 \
npm run migrate:contentful
```

After migration, all content is stored in MongoDB and editable from `/admin`.
