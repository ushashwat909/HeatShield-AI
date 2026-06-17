"""Authentication API endpoints."""
from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

from app.config import settings
from app.schemas.schemas import UserLogin, UserRegister, UserResponse, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory user store for development
_users_db = {
    "admin": {
        "id": 1,
        "username": "admin",
        "email": "admin@heatshield.gov.in",
        "password_hash": pwd_context.hash("admin123"),
        "full_name": "System Administrator",
        "role": "admin",
        "is_active": True,
        "created_at": datetime.utcnow(),
    },
    "researcher": {
        "id": 2,
        "username": "researcher",
        "email": "researcher@heatshield.gov.in",
        "password_hash": pwd_context.hash("research123"),
        "full_name": "Dr. Research Analyst",
        "role": "researcher",
        "is_active": True,
        "created_at": datetime.utcnow(),
    },
}

_user_id_counter = len(_users_db) + 1


def _create_token(username: str, role: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": username, "role": role, "exp": expire},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


@router.post("/login", response_model=TokenResponse, summary="User login")
async def login(credentials: UserLogin):
    """Authenticate user and return JWT token."""
    user = _users_db.get(credentials.username)
    if not user or not pwd_context.verify(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    token = _create_token(user["username"], user["role"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "is_active": user["is_active"],
            "created_at": user["created_at"],
        },
    }


@router.post("/register", response_model=TokenResponse, summary="User registration")
async def register(data: UserRegister):
    """Register a new user account."""
    global _user_id_counter

    if data.username in _users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )

    user = {
        "id": _user_id_counter,
        "username": data.username,
        "email": data.email,
        "password_hash": pwd_context.hash(data.password),
        "full_name": data.full_name,
        "role": data.role.value,
        "is_active": True,
        "created_at": datetime.utcnow(),
    }
    _users_db[data.username] = user
    _user_id_counter += 1

    token = _create_token(user["username"], user["role"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "is_active": user["is_active"],
            "created_at": user["created_at"],
        },
    }
