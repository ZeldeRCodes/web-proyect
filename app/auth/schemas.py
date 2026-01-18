from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    name: str
    password: str
    role: str = "user"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str

    class Config:
        orm_mode = True
