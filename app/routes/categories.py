from fastapi import APIRouter, Depends
from app.auth.deps import require_admin

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("/")
def create_category(name: str, admin = Depends(require_admin)):
    return {"message": f"Categoría '{name}' creada por admin {admin.email}"}
