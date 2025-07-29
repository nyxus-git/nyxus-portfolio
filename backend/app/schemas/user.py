# backend/app/schemas/user.py
from pydantic import BaseModel, EmailStr

# Properties to receive via API on creation
class UserCreate(BaseModel):
    email: EmailStr
    password: str

# Properties to receive via API on update (optional fields)
class UserUpdate(BaseModel):
    email: EmailStr | None = None
    password: str | None = None
    is_active: bool | None = None
    is_superuser: bool | None = None

# Properties shared by models stored in DB
class UserInDBBase(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    is_superuser: bool

    class Config:
        from_attributes = True # For compatibility with ORMs like SQLAlchemy

# Properties to return to client
class User(UserInDBBase):
    pass

# Properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str