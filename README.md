# Plataforma de Inovação Colaborativa

Este repositório reúne o MVP da plataforma de inovação colaborativa desenvolvida por **Guilherme Piragibe, Rafael Fernandes, Rafael Benites e Lucas Freires** como parte da disciplina de Engenharia de Software (Mackenzie 2025/2). O objetivo é conectar idealizadores e colaboradores através de uma arquitetura de microsserviços (FastAPI + SQLModel) e um frontend React/TypeScript.

---

## Visão Geral

- **Backend** (`backend/`): Serviços independentes (Auth, Profiles, Projects, Applications, Match, Notifications, API Gateway) em FastAPI + SQLModel com SQLite para persistência local.
- **Frontend** (`frontend/`): Portal React 18 + TypeScript + Vite consumindo os microsserviços.
- **Coleção Postman** (`postman/`): Rotas principais para cada serviço.
- **Script utilitário**: `backend/run_all_services.py` inicia todos os micros simultaneamente para desenvolvimento local.
- **Testes**:
  - `python -m pytest backend` — cobre os fluxos principais de cada serviço.
  - `npm run build` e `npm run dev` — garantem o build e desenvolvimento do frontend.

---

## Pré-Requisitos

- Python 3.12+
- Node.js 20+ e npm
- Ambiente virtual (`python -m venv .venv`)
- Dependências Python: `pip install -r requirements.txt`
- Dependências frontend: `cd frontend && npm install`

---

## Backend (Microsserviços)

| Serviço              | Porta | Descrição                                                 |
|----------------------|-------|-----------------------------------------------------------|
| `auth_svc`           | 8001  | Registro, login, emissão de JWT                          |
| `profiles_svc`       | 8002  | Perfil de colaboradores/idealizadores                     |
| `projects_svc`       | 8003  | Cadastro e consulta de projetos/vagas                     |
| `applications_svc`   | 8004  | Fluxo de candidaturas e convites                          |
| `match_svc` (mock)   | 8005  | Recomendações heurísticas                                 |
| `notifications_svc` (mock) | 8006 | Notificações mockadas (email/in-app)                  |
| `api_gateway`        | 8000  | Registro estático das rotas (placeholder)                 |

### Rodando todos os serviços de uma vez

```bash
.venv\Scripts\activate
python backend/run_all_services.py       # com auto-reload
# python backend/run_all_services.py --no-reload
```

Esse script inicia cada serviço com Uvicorn. Pressione `Ctrl+C` para encerrar tudo.

### Rodando serviços individualmente

```bash
cd backend/<nome_do_serviço>
uvicorn app.main:app --reload --port <porta>
```

Swaggers disponíveis em `http://localhost:<porta>/docs`.

### Testes backend

```bash
.venv\Scripts\activate
python -m pytest backend
```

- `auth_svc/tests/test_auth.py`: registro/login/duplicidade.
- `profiles_svc/tests/test_profiles.py`: CRUD de perfil, skills, interesses e portfólio.
- `projects_svc/tests/test_projects.py`: CRUD de projetos e filtros por tag.
- `applications_svc/tests/test_applications.py`: candidaturas e mudança de status.
- `match_svc/tests/test_match.py`: recomendações mockadas.
- `notifications_svc/tests/test_notifications.py`: enfileiramento mock.
- `api_gateway/tests/test_gateway.py`: lista de serviços e status do gateway.

---

## Frontend (Portal React)

Localizado em `frontend/`.

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
# npm run build (produção)
```

### Integração com o backend

- Por padrão, o frontend consome os serviços diretamente (`http://localhost:8001-8006`).
- As variáveis `APP_*_API_URL` em `vite.config` podem ser definidas para apontar para outros hosts.
- `X-User-Id` é enviado automaticamente; substitua por validação JWT quando o `auth_svc` estiver integrado.

### Principais páginas

- `ProfilePage` / `EditProfilePage`: gerenciamento de perfil, habilidades, interesses e portfólio.
- `ProjectListPage`: lista de projetos com filtro por tag e envio de pitch.
- `MyApplicationsPage`: acompanhamento de candidaturas e status.

---

## Postman Collection

- `postman/microservices.postman_collection.json`
- Inclui chamadas para todos os serviços. Ajuste variáveis (`auth_token`, hosts, X-User-Id) conforme seu ambiente.

---

## Guia Rápido para Clonar e Rodar

```bash
git clone <repo>
cd projeto-eng-soft

# Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python backend/run_all_services.py

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173` e utilize as rotas expostas pelos microsserviços.

---

## Equipe

- **Guilherme Piragibe**
- **Rafael Benites**
- **Lucas Freires**

---

## Próximos Passos Recomendados

- Docker Compose para orquestração (FastAPI + SQLite + frontend).
- Integração via JWT do `auth_svc` com os demais serviços (removendo `X-User-Id` manual).
- Pipelines CI/CD com execução de testes (pytest + build frontend).
- Evoluir `match_svc` e `notifications_svc` além da camada mock.

---

Com esse setup, você consegue levantar todos os componentes localmente, exercitar os fluxos principais (perfil, projetos, candidaturas) e adaptar para ambientes mais robustos conforme o projeto evolui. Boas contribuições!
