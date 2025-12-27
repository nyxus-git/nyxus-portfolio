# Rohan Mane - Portfolio

A modern, glassmorphic portfolio website built with Next.js, Tailwind CSS, and Framer Motion, featuring dynamic content management via Contentful.

## 🚀 Tech Stack

-   **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
-   **CMS**: Contentful
-   **Backend**: Python (FastAPI) - *For contact form functionality*
-   **Design**: Glassmorphism, Animated Gradients, Lucide Icons

## 🛠️ Setup & Installation

### Prerequisites

-   Node.js (v18+)
-   Python 3.8+
-   Contentful Account

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/nyxus-portfolio.git
cd nyxus-portfolio
\`\`\`

### 2. Frontend Setup

\`\`\`bash
cd frontend
npm install
\`\`\`

Create a `.env.local` file in the `frontend` directory:

\`\`\`env
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_access_token
\`\`\`

Run the development server:

\`\`\`bash
npm run dev
\`\`\`

The site will be available at [http://localhost:3000](http://localhost:3000).

### 3. Backend Setup (Contact Form)

\`\`\`bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
\`\`\`

Create a `.env` file in the `backend` directory (if needed for email creds):

\`\`\`env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RECIPIENT_EMAIL=your_email@gmail.com
\`\`\`

Run the backend server:

\`\`\`bash
uvicorn app.main:app --reload
\`\`\`

## 📂 Project Structure

-   `/frontend`: Next.js application (UI, Pages, Components)
-   `/backend`: FastAPI application (API, Email logic)

## ✨ key Features

-   **Dynamic Content**: Projects, Experience, Certifications, and Blogs are fetched from Contentful.
-   **Modern UI**: Glassmorphism design with animated backgrounds and interactions.
-   **Responsive**: Fully optimized for mobile and desktop.