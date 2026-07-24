from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.database import Base, engine, SessionLocal
from .models import project, experience, certification, blog, skill as skill_model
from .api.routes import auth, projects, experience as exp_routes, certifications, blogs, profile, demo, upload
import os

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Rohan Mane Portfolio API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(exp_routes.router, prefix="/api/experience", tags=["experience"])
app.include_router(certifications.router, prefix="/api/certifications", tags=["certifications"])
app.include_router(blogs.router, prefix="/api/blogs", tags=["blogs"])
app.include_router(profile.router, prefix="/api", tags=["profile"])
app.include_router(demo.router, prefix="/api/demo", tags=["demo"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])

# Mount static files for uploads
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/")
def read_root():
    return {"status": "ok", "message": "Rohan Mane Portfolio API"}


@app.on_event("startup")
def seed_database():
    """Seed the database with initial data if empty."""
    db = SessionLocal()
    try:
        # --- About ---
        from .models.skill import About
        if db.query(About).count() == 0:
            about = About(
                name="Rohan Mane",
                tagline="Building intelligent systems that make a real impact",
                bio="Hi, I'm Rohan Mane, an aspiring machine learning engineer and full stack developer with hands-on experience in AI, open source contributions, and Linux. I completed an internship at DIAT-DRDO, where I worked on computer vision and signal processing systems.",
                bio2="I'm driven by the desire to build intelligent systems and innovative tech solutions. Passionate about open source, AI research, and creating tools that solve real-world problems. Let's connect and build something amazing together!",
                email="rohanmane@example.com",
                phone="+91 9356216808",
                location="Pune, Maharashtra",
                github_url="https://github.com/nyxus-git",
                linkedin_url="https://www.linkedin.com/in/nyxus-link/",
                twitter_url="https://x.com/NyxusXplore",
                youtube_url="https://www.youtube.com/@nyxus-linux",
                leetcode_url="https://leetcode.com/u/nyxus-dsa/",
                resume_url="/Rohan_Resume.pdf",
                profile_image="/profile.jpeg",
                roles="AI Engineer,ML Engineer,Full Stack Developer,Linux Enthusiast,Open Source Contributor"
            )
            db.add(about)

        # --- Skills ---
        from .models.skill import Skill
        if db.query(Skill).count() == 0:
            skills_data = [
                # Languages
                {"name": "Python", "level": 90, "category": "PROGRAMMING LANGUAGES", "order_index": 0},
                {"name": "JavaScript", "level": 85, "category": "PROGRAMMING LANGUAGES", "order_index": 1},
                {"name": "TypeScript", "level": 78, "category": "PROGRAMMING LANGUAGES", "order_index": 2},
                {"name": "HTML5 & CSS3", "level": 95, "category": "PROGRAMMING LANGUAGES", "order_index": 3},
                {"name": "Bash / Shell", "level": 80, "category": "PROGRAMMING LANGUAGES", "order_index": 4},
                {"name": "SQL", "level": 75, "category": "PROGRAMMING LANGUAGES", "order_index": 5},
                # Frameworks
                {"name": "TensorFlow / Keras", "level": 85, "category": "FRAMEWORKS & LIBRARIES", "order_index": 0},
                {"name": "scikit-learn", "level": 90, "category": "FRAMEWORKS & LIBRARIES", "order_index": 1},
                {"name": "PyTorch", "level": 75, "category": "FRAMEWORKS & LIBRARIES", "order_index": 2},
                {"name": "React.js / Next.js", "level": 82, "category": "FRAMEWORKS & LIBRARIES", "order_index": 3},
                {"name": "FastAPI / Flask", "level": 88, "category": "FRAMEWORKS & LIBRARIES", "order_index": 4},
                {"name": "Pandas / NumPy", "level": 92, "category": "FRAMEWORKS & LIBRARIES", "order_index": 5},
                {"name": "OpenCV", "level": 80, "category": "FRAMEWORKS & LIBRARIES", "order_index": 6},
                # Tools
                {"name": "Git & GitHub", "level": 90, "category": "TOOLS & TECHNOLOGIES", "order_index": 0},
                {"name": "Linux (Arch)", "level": 88, "category": "TOOLS & TECHNOLOGIES", "order_index": 1},
                {"name": "Docker", "level": 72, "category": "TOOLS & TECHNOLOGIES", "order_index": 2},
                {"name": "Jupyter Notebook", "level": 95, "category": "TOOLS & TECHNOLOGIES", "order_index": 3},
                {"name": "Matplotlib / Seaborn", "level": 85, "category": "TOOLS & TECHNOLOGIES", "order_index": 4},
                {"name": "MongoDB / SQLite", "level": 78, "category": "TOOLS & TECHNOLOGIES", "order_index": 5},
            ]
            for s in skills_data:
                db.add(Skill(**s))

        # --- Projects ---
        from .models.project import Project
        if db.query(Project).count() == 0:
            projects_data = [
                {
                    "title": "Sentiment Analysis Web App",
                    "description": "A full-stack NLP web application that performs real-time sentiment analysis on user-entered text. Built with a Flask backend using a fine-tuned BERT model and a React frontend. Supports multi-class classification (positive, negative, neutral) with confidence scores and visual probability charts.",
                    "tech_stack": ["Python", "Flask", "BERT", "HuggingFace", "React", "scikit-learn", "NLTK"],
                    "github_url": "https://github.com/nyxus-git",
                    "live_url": None,
                    "image_url": None,
                    "featured": 1,
                    "order_index": 0
                },
                {
                    "title": "Image Classifier with CNN",
                    "description": "Deep learning image classification system using a custom Convolutional Neural Network trained on CIFAR-10 and custom datasets. Achieves 94% accuracy. Includes a Streamlit web interface for uploading and classifying images with Grad-CAM visualizations to explain model decisions.",
                    "tech_stack": ["Python", "TensorFlow", "Keras", "OpenCV", "Streamlit", "NumPy", "Matplotlib"],
                    "github_url": "https://github.com/nyxus-git",
                    "live_url": None,
                    "image_url": None,
                    "featured": 1,
                    "order_index": 1
                },
                {
                    "title": "Stock Price Predictor (LSTM)",
                    "description": "Time-series forecasting model using LSTM neural networks to predict stock prices up to 30 days ahead. Fetches live data via Yahoo Finance API, preprocesses with technical indicators (RSI, MACD, Bollinger Bands), and visualizes predictions with an interactive Plotly dashboard.",
                    "tech_stack": ["Python", "TensorFlow", "LSTM", "Pandas", "yfinance", "Plotly", "Streamlit"],
                    "github_url": "https://github.com/nyxus-git",
                    "live_url": None,
                    "image_url": None,
                    "featured": 1,
                    "order_index": 2
                },
                {
                    "title": "Face Detection & Recognition System",
                    "description": "Real-time face detection and recognition system using OpenCV and MediaPipe. Features include multi-face tracking, facial landmark detection, emotion recognition, and attendance marking. Built as a desktop application with Tkinter GUI and SQLite storage for registered users.",
                    "tech_stack": ["Python", "OpenCV", "MediaPipe", "DeepFace", "Tkinter", "SQLite", "NumPy"],
                    "github_url": "https://github.com/nyxus-git",
                    "live_url": None,
                    "image_url": None,
                    "featured": 1,
                    "order_index": 3
                },
                {
                    "title": "ML Playground — Interactive Learning Platform",
                    "description": "An educational web platform for learning machine learning concepts interactively. Users can train simple models (linear regression, decision trees, k-means) on toy datasets through a drag-and-drop interface, visualize decision boundaries in real time, and compare algorithm performance.",
                    "tech_stack": ["React", "Python", "FastAPI", "scikit-learn", "D3.js", "TailwindCSS"],
                    "github_url": "https://github.com/nyxus-git",
                    "live_url": None,
                    "image_url": None,
                    "featured": 1,
                    "order_index": 4
                },
                {
                    "title": "Portfolio Website (This Site!)",
                    "description": "Production-ready developer portfolio with a Next.js frontend and FastAPI backend. Features an admin dashboard with JWT-protected CRUD operations for all portfolio sections, SQLite database, dark glassmorphism design, Framer Motion animations, and full contact form integration.",
                    "tech_stack": ["Next.js", "TypeScript", "FastAPI", "Python", "SQLite", "SQLAlchemy", "TailwindCSS"],
                    "github_url": "https://github.com/nyxus-git",
                    "live_url": None,
                    "image_url": None,
                    "featured": 0,
                    "order_index": 5
                },
            ]
            for p in projects_data:
                db.add(Project(**p))

        # --- Experience ---
        from .models.experience import Experience
        if db.query(Experience).count() == 0:
            exp_data = [
                {
                    "job_title": "Machine Learning Intern",
                    "company_name": "DIAT-DRDO (Defence Institute of Advanced Technology)",
                    "location": "Pune, Maharashtra",
                    "start_date": "2024-06-01",
                    "end_date": "2024-08-31",
                    "description": "Worked on computer vision and signal processing projects for defence applications. Developed a real-time object detection pipeline using YOLOv8 achieving 89% mAP on custom datasets. Implemented signal denoising algorithms using wavelet transforms in Python. Contributed to a research paper on radar signal classification using ML techniques.",
                    "order_index": 0
                },
                {
                    "job_title": "Open Source Contributor",
                    "company_name": "Various Open Source Projects (GitHub)",
                    "location": "Remote",
                    "start_date": "2022-01-01",
                    "end_date": None,
                    "description": "Active contributor to open source ML and Linux projects on GitHub. Submitted PRs for bug fixes and feature additions to scikit-learn utilities and Arch Linux community packages. Maintain personal open source tools for Arch Linux configuration automation with 100+ stars.",
                    "order_index": 1
                },
                {
                    "job_title": "Freelance Web Developer",
                    "company_name": "Self-Employed",
                    "location": "Remote",
                    "start_date": "2023-01-01",
                    "end_date": None,
                    "description": "Designed and developed full-stack web applications for small businesses and startups. Built REST APIs with FastAPI and Flask, integrated AI features (chatbots, recommendation systems), and deployed on cloud platforms. Worked with 5+ clients delivering scalable solutions.",
                    "order_index": 2
                }
            ]
            for e in exp_data:
                db.add(Experience(**e))

        # --- Certifications ---
        from .models.certification import Certification
        if db.query(Certification).count() == 0:
            cert_data = [
                {
                    "name": "Machine Learning Specialization",
                    "issuing_organization": "DeepLearning.AI / Coursera",
                    "issue_date": "2024-03-01",
                    "credential_id": "ML-SPEC-2024-DL",
                    "credential_url": "https://coursera.org/verify",
                    "skills": ["Supervised Learning", "Unsupervised Learning", "Neural Networks", "Python"],
                    "order_index": 0
                },
                {
                    "name": "Deep Learning Specialization",
                    "issuing_organization": "DeepLearning.AI / Coursera",
                    "issue_date": "2024-06-01",
                    "credential_id": "DL-SPEC-2024-DL",
                    "credential_url": "https://coursera.org/verify",
                    "skills": ["CNNs", "RNNs", "LSTM", "Transformers", "TensorFlow"],
                    "order_index": 1
                },
                {
                    "name": "Python for Data Science and AI",
                    "issuing_organization": "IBM / Coursera",
                    "issue_date": "2023-09-01",
                    "credential_id": "IBM-PY-DS-2023",
                    "credential_url": "https://coursera.org/verify",
                    "skills": ["Python", "Pandas", "NumPy", "Matplotlib", "scikit-learn"],
                    "order_index": 2
                },
                {
                    "name": "Linux Fundamentals (LFS101x)",
                    "issuing_organization": "The Linux Foundation / edX",
                    "issue_date": "2023-05-01",
                    "credential_id": "LF-LFS101-2023",
                    "credential_url": "https://edx.org/verify",
                    "skills": ["Linux", "Bash", "System Administration", "Shell Scripting"],
                    "order_index": 3
                },
                {
                    "name": "Responsive Web Design",
                    "issuing_organization": "freeCodeCamp",
                    "issue_date": "2022-11-01",
                    "credential_id": "FCC-RWD-2022",
                    "credential_url": "https://freecodecamp.org/certification",
                    "skills": ["HTML5", "CSS3", "Flexbox", "Grid", "Responsive Design"],
                    "order_index": 4
                },
            ]
            for c in cert_data:
                db.add(Certification(**c))

        # --- Blogs ---
        from .models.blog import Blog
        if db.query(Blog).count() == 0:
            blogs_data = [
                {
                    "title": "Getting Started with Machine Learning: A Beginner's Roadmap",
                    "slug": "getting-started-with-machine-learning",
                    "excerpt": "A comprehensive guide for beginners looking to break into machine learning. From Python basics to your first ML model — everything you need to know to start your AI journey.",
                    "content": "# Getting Started with Machine Learning\n\nMachine learning is one of the most exciting fields in technology today...\n\n## Step 1: Learn Python\n\nPython is the language of ML. Start with the basics: variables, loops, functions, and then move to libraries like NumPy and Pandas.\n\n## Step 2: Mathematics\n\nYou need a solid foundation in:\n- Linear Algebra (vectors, matrices)\n- Statistics and Probability\n- Calculus (for understanding gradients)\n\n## Step 3: scikit-learn\n\nStart with scikit-learn for classical ML algorithms. Implement linear regression, decision trees, and k-means clustering on real datasets.",
                    "author": "Rohan Mane",
                    "date": "2024-07-01",
                    "tags": "machine-learning,python,beginner,AI",
                    "published": 1
                },
                {
                    "title": "Why I Switched from Windows to Arch Linux (and Never Looked Back)",
                    "slug": "switched-to-arch-linux",
                    "excerpt": "My journey from a Windows user to an Arch Linux enthusiast. The challenges, the learning curve, and why it made me a better developer.",
                    "content": "# Why I Switched to Arch Linux\n\nSwitching to Arch Linux was one of the best decisions I made as a developer...\n\n## The Learning Curve\n\nArch Linux has a steep learning curve, but that's exactly the point. You learn how Linux actually works — from partitioning to configuring your display manager.\n\n## Benefits for Developers\n\n- Complete control over your system\n- Rolling release (always latest packages)\n- AUR (Arch User Repository) — massive package ecosystem\n- Lightweight and fast\n\n## Tips for Beginners\n\nStart with the Arch Wiki — it's the best documentation in the Linux world.",
                    "author": "Rohan Mane",
                    "date": "2024-05-15",
                    "tags": "linux,arch-linux,developer-tools,os",
                    "published": 1
                },
                {
                    "title": "Building Your First Neural Network with TensorFlow",
                    "slug": "first-neural-network-tensorflow",
                    "excerpt": "Step-by-step tutorial on building, training, and evaluating a neural network from scratch using TensorFlow and Keras. Complete with code and visualizations.",
                    "content": "# Building Your First Neural Network\n\nIn this tutorial, we'll build a complete neural network to classify handwritten digits from the MNIST dataset.\n\n## Setup\n\n```python\nimport tensorflow as tf\nimport numpy as np\nimport matplotlib.pyplot as plt\n```\n\n## Loading Data\n\n```python\n(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()\nx_train = x_train / 255.0\nx_test = x_test / 255.0\n```\n\n## Building the Model\n\n```python\nmodel = tf.keras.Sequential([\n    tf.keras.layers.Flatten(input_shape=(28, 28)),\n    tf.keras.layers.Dense(128, activation='relu'),\n    tf.keras.layers.Dropout(0.2),\n    tf.keras.layers.Dense(10, activation='softmax')\n])\n```",
                    "author": "Rohan Mane",
                    "date": "2024-03-20",
                    "tags": "tensorflow,deep-learning,neural-networks,tutorial",
                    "published": 1
                },
            ]
            for b in blogs_data:
                db.add(Blog(**b))

        db.commit()
    except Exception as e:
        print(f"Seed error: {e}")
        db.rollback()
    finally:
        db.close()
