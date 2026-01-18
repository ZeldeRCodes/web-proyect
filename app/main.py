from fastapi import FastAPI
from app.auth.routes import router as auth_router
from app.categories.routes import router as categories_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(categories_router)
