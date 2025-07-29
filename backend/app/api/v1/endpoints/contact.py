# backend/app/api/v1/endpoints/contact.py
from fastapi import APIRouter, HTTPException, status
# For now, we'll use a Pydantic model directly. Later, you can create a schema.
from pydantic import BaseModel, EmailStr

# --- Pydantic Model for Contact Form Data ---
# In a full setup, this would likely be in app/schemas/contact.py
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str
# --- End Pydantic Model ---

router = APIRouter()

@router.post("/")
async def send_contact_message(contact_form: ContactForm):
    """
    Receive contact form data.
    In the future, this will save to DB and send an email.
    For now, it just prints to the console.
    """
    print(f"--- CONTACT FORM RECEIVED ---")
    print(f"Name: {contact_form.name}")
    print(f"Email: {contact_form.email}")
    print(f"Message: {contact_form.message}")
    print(f"-------------------------------")
    # TODO: Save to database (e.g., db.add(db_message); db.commit())
    # TODO: Send email using app.utils.email
    return {"message": "Message received successfully!"}