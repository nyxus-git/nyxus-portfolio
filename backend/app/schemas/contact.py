# backend/app/schemas/contact.py
from pydantic import BaseModel, EmailStr

class ContactFormData(BaseModel):
    name: str
    email: EmailStr
    message: str