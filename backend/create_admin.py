# backend/create_admin.py
import sys
import os

# Add the parent directory to the path so we can import 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app import crud, schemas
from app.core.security import get_password_hash
from app.database import SessionLocal, engine
from app import models

def create_admin_user(email: str, password: str):
    db = SessionLocal()
    try:
        # Check if user already exists
        existing_user = crud.get_user_by_email(db, email=email)
        if existing_user:
            print(f"User with email {email} already exists.")
            return

        # Create user schema
        user_in = schemas.UserCreate(
            email=email,
            password=password
        )

        # Create the user object with is_superuser=True
        db_user = models.User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            is_active=True,
            is_superuser=True # Make this user an admin
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        print(f"Admin user {email} created successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python create_admin.py <email> <password>")
        sys.exit(1)

    email = sys.argv[1]
    password = sys.argv[2]
    create_admin_user(email, password)
