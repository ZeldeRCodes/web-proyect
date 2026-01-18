from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import Category
from app.routes.category_schemas import CategoryCreate, CategoryUpdate, CategoryResponse
from app.auth.deps import get_current_user, require_admin

router = APIRouter(prefix="/categories", tags=["Categories"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear categoría (solo admin)
@router.post("/", response_model=CategoryResponse)
def create_category(data: CategoryCreate, db: Session = Depends(get_db), admin = Depends(require_admin)):
    existing = db.query(Category).filter(Category.name == data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="La categoría ya existe")

    category = Category(name=data.name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

# Listar categorías (todos)
@router.get("/", response_model=list[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

# Editar categoría (solo admin)
@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(category_id: int, data: CategoryUpdate, db: Session = Depends(get_db), admin = Depends(require_admin)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    category.name = data.name
    db.commit()
    db.refresh(category)
    return category

# Eliminar categoría (solo admin)
@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), admin = Depends(require_admin)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    db.delete(category)
    db.commit()
    return {"message": "Categoría eliminada"}
