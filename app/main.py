from fastapi import FastAPI
from app.db.database import Base, engine
from app.auth.routes import router as auth_router
from app.routes.categories import router as categories_router

app = FastAPI()

# Crear tablas automáticamente
Base.metadata.create_all(bind=engine)

# Rutas
app.include_router(auth_router)
app.include_router(categories_router)

@app.get("/")
def root():
    return {"status": "ok", "message": "API funcionando"}
