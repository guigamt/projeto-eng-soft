from fastapi import FastAPI, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from models import User
from auth import hash_password, verify_password

# Cria as tabelas do banco (caso não existam)
Base.metadata.create_all(bind=engine)

# Inicializa o app FastAPI
app = FastAPI(title="Microserviço de Usuários (Simples e Limpo)")

# Permite conexão com o front-end (CORS liberado)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rota de status
@app.get("/")
def root():
    return {"message": "Microserviço de Usuários está online. Acesse /docs"}

# Rota de cadastro
@app.post("/cadastro")
def cadastrar_usuario(
    nome: str = Form(...),
    email: str = Form(...),
    senha: str = Form(...),
    telefone: str = Form(None),
    is_idealizador: bool = Form(False),
    db: Session = Depends(get_db)
):
    # Verifica se já existe usuário com esse e-mail
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")

    # Cria novo usuário com hash de senha
    senha_hash = hash_password(senha)
    novo_usuario = User(
        nome=nome,
        email=email,
        senha_hash=senha_hash,
        telefone=telefone,
        is_idealizador=is_idealizador
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return {"message": f"Usuário {nome} cadastrado com sucesso!", "id": novo_usuario.id}

# Rota de login
@app.post("/login")
def login(
    email: str = Form(...),
    senha: str = Form(...),
    db: Session = Depends(get_db)
):
    usuario = db.query(User).filter(User.email == email).first()

    if not usuario or not verify_password(senha, usuario.senha_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")

    return {"message": f"Bem-vindo, {usuario.nome}!", "email": usuario.email}
