from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from passlib.context import CryptContext

import models
from database import engine, get_db

# Crear las tablas en la base de datos si no existen
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kóre API", version="1.0.0")

# Configurar CORS para que tu frontend JS pueda comunicarse con el backend sin bloqueos
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción puedes restringirlo a tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración para hashear contraseñas de forma segura con bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Esquema Pydantic para validar los datos que vienen del formulario de Sign up
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@app.post("/api/signup", status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Verificar si el correo o el usuario ya existen
    existing_user = db.query(models.User).filter(
        (models.User.email == user.email) | (models.User.username == user.username)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo o el nombre de usuario ya están registrados."
        )

    # 2. Hashear la contraseña (nunca se guarda en texto plano)
    hashed_password = pwd_context.hash(user.password)

    # 3. Crear la instancia del modelo User
    new_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password
    )

    # 4. Guardar en la base de datos (PostgreSQL)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Usuario registrado exitosamente en Kóre",
        "user": {
            "id": str(new_user.id),
            "username": new_user.username,
            "email": new_user.email
        }
    }


@app.post("/api/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    # 1. Buscar al usuario por su correo en la base de datos
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos"
        )
    
    # 2. Verificar si la contraseña coincide con el hash guardado
    if not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos"
        )
    
    # 3. Respuesta exitosa (aquí luego retornaremos un token JWT)
    return {
        "message": "¡Inicio de sesión exitoso!",
        "username": db_user.username,
        "email": db_user.email
    }