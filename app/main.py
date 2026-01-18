from fastapi import FastAPI
from app.db.database import Base, engine

app = FastAPI()

# Crear tablas automáticamente si no existen
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"status": "ok", "message": "API funcionando"}
