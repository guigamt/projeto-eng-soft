
---

```markdown
# Technical Specification — Colaborador Service
## Projeto de Engenharia de Software com Microsserviços — Mackenzie 2025/2

### Contexto
O projeto é uma **plataforma de inovação colaborativa com IA** desenvolvida em arquitetura de **microsserviços**.  
O sistema conecta **idealizadores** que possuem ideias de projetos a **colaboradores** com habilidades específicas, facilitando a criação de equipes multidisciplinares.

Este documento define o escopo técnico do **microsserviço do Colaborador**, sob responsabilidade de Guilherme Meira.

---

## 1. Função do Colaborador
O **Colaborador** é o usuário com habilidades (técnicas ou não) que deseja participar de um projeto.  
Deve poder:
- Criar e editar seu perfil (bio, headline, cidade, disponibilidade);
- Adicionar habilidades e níveis de proficiência;
- Registrar interesses (tags de área, ex: IA, UX, marketing);
- Criar portfólio (links, descrições, projetos);
- Explorar projetos e filtrar por tags;
- Candidatar-se a projetos com um pitch;
- Visualizar o status de candidaturas;
- Receber e responder convites de idealizadores.

---

## 2. Arquitetura

### Estrutura de Microsserviços
- **auth-svc** — autenticação e autorização (JWT);
- **profiles-svc** — perfis de usuários (Colaborador e Idealizador);
- **projects-svc** — registro e busca de projetos;
- **applications-svc** — candidaturas e convites;
- **match-svc (IA)** — recomendação e enriquecimento de perfil (pós-MVP);
- **notifications-svc** — notificações e e-mails (pós-MVP).

O serviço sob este escopo é o **profiles-svc**, com foco no perfil do Colaborador.

---

## 3. Stack Tecnológica
### Backend
- **Linguagem:** Python 3.12+
- **Framework:** FastAPI
- **ORM:** SQLModel (SQLAlchemy + Pydantic)
- **Banco de dados:** PostgreSQL (alternativa inicial: SQLite)
- **Autenticação:** JWT (via `auth-svc`)
- **Hospedagem:** Render / Railway / Docker Compose
- **Documentação automática:** Swagger (`/docs`)

### Frontend
- **Framework:** React 18 + TypeScript
- **Bundler:** Vite
- **UI Library:** TailwindCSS (opcional)
- **HTTP Client:** Axios
- **State management:** React Query / Context API
- **Deploy:** Vercel / Netlify

---

## 4. Estrutura de Pastas

### Backend (`profiles-svc`)
```

backend/
app/
main.py
api/
routes_collaborator.py
models/
collaborator_profile.py
skill.py
interest.py
portfolio.py
schemas/
collaborator.py
skill.py
interest.py
portfolio.py
core/
config.py
security.py
db/
session.py
init_db.py
services/
collaborator_service.py

```

### Frontend
```

frontend/
src/
api/
http.ts
collaborator.ts
projects.ts
applications.ts
types/
collaborator.ts
project.ts
pages/
Collaborator/
ProfilePage.tsx
EditProfilePage.tsx
Projects/
ProjectListPage.tsx
Applications/
MyApplicationsPage.tsx
components/
ProfileForm.tsx
SkillSelector.tsx
TagSelector.tsx
main.tsx
App.tsx

```

---

## 5. Modelos de Dados

### CollaboratorProfile
| Campo | Tipo | Descrição |
|-------|------|------------|
| id | int | Identificador único |
| user_id | int | FK para `users` (auth-svc) |
| headline | str | Frase de destaque |
| bio | str | Descrição breve |
| location_city | str | Cidade |
| location_state | str | Estado |
| availability_hours_per_week | int | Disponibilidade semanal |
| work_mode | enum | REMOTE / HYBRID / ONSITE |

### Skills
| Campo | Tipo | Descrição |
|-------|------|------------|
| id | int | Identificador |
| name | str | Nome da habilidade |
| level | int | Nível (1–5) |

### Interests
| Campo | Tipo | Descrição |
|-------|------|------------|
| id | int | Identificador |
| slug | str | Tag (ex: “machine-learning”) |
| label | str | Nome legível |

### Portfolio
| Campo | Tipo | Descrição |
|-------|------|------------|
| id | int | Identificador |
| title | str | Nome do projeto |
| url | str | Link do projeto |
| description | str | Breve explicação |
| thumb_url | str | Miniatura (opcional) |

---

## 6. Endpoints REST

### Profiles
| Método | Rota | Descrição |
|---------|------|-----------|
| `GET` | `/api/profiles/collaborators/me` | Retorna o perfil do usuário logado |
| `POST` | `/api/profiles/collaborators` | Cria o perfil do colaborador |
| `PUT` | `/api/profiles/collaborators/me` | Atualiza o perfil |

### Skills / Interests / Portfolio
| Método | Rota | Descrição |
|---------|------|-----------|
| `POST` | `/me/skills` | Adiciona habilidade |
| `DELETE` | `/me/skills/:id` | Remove habilidade |
| `POST` | `/me/interests` | Adiciona interesse |
| `DELETE` | `/me/interests/:id` | Remove interesse |
| `POST` | `/me/portfolio` | Adiciona item de portfólio |
| `DELETE` | `/me/portfolio/:id` | Remove item de portfólio |

### Applications
| Método | Rota | Descrição |
|---------|------|-----------|
| `POST` | `/api/applications` | Envia candidatura |
| `GET` | `/api/applications/me` | Lista candidaturas do usuário |
| `PATCH` | `/api/applications/:id` | Atualiza status da candidatura |

---

## 7. MVP (Produto Mínimo Viável)
1. CRUD de perfil do colaborador;
2. Cadastro de habilidades, interesses e portfólio;
3. Listagem de projetos (mock);
4. Candidatura a projetos;
5. Atualização de status;
6. Visualização de convites;
7. Documentação via Swagger.

---

## 8. Extensões Pós-MVP
- IA para enriquecimento de perfil (recomendações automáticas de skills);
- IA para recomendação de projetos (“Matchmaking Inteligente”);
- Sistema de notificações e mensagens;
- Integração com redes sociais ou portfólios (GitHub, Behance).

---

## 9. Critérios de Avaliação
- Funcionalidade (5 pts)
- Qualidade (2 pts)
- Robustez (2 pts)
- Aplicação de conceitos do curso (1 pt)
- Participação individual (avaliação docente)

---

## 10. Próximos Passos
- [x] Criar o backend mínimo (FastAPI) com `GET`, `POST`, `PUT`.
- [x] Criar o frontend com formulário de perfil.
- [ ] Persistir dados em SQLite.
- [ ] Adicionar candidaturas (`applications-svc`).
- [ ] Docker Compose com banco e serviço.
- [ ] MVP + Deploy (P9).

---

**Autor:** Guilherme Meira  
**Disciplina:** Engenharia de Software — Mackenzie 2025/2  
**Microsserviço:** `profiles-svc` (Colaborador)
```

---
