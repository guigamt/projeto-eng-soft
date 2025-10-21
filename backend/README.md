# Backend Microservices

Este diretorio contem os microservicos do MVP da plataforma de inovacao colaborativa. Cada servico roda como um projeto FastAPI independente e pode ser iniciado isoladamente durante o desenvolvimento.

## Estrutura

| Servico | Pasta | Porta sugerida | Responsabilidade |
|---------|-------|----------------|------------------|
| Auth | `auth_svc` | 8001 | Registro, login e emissao de tokens JWT |
| Profiles | `profiles_svc` | 8002 | Perfis de colaboradores/idealizadores, habilidades, interesses e portfolio |
| Projects | `projects_svc` | 8003 | Cadastro e consulta de projetos e vagas |
| Applications | `applications_svc` | 8004 | Fluxo de candidaturas e convites |
| Match (mock) | `match_svc` | 8005 | Recomendacoes heuristicas para colaborador e projeto |
| Notifications (mock) | `notifications_svc` | 8006 | Fila ficticia para e-mails e notificacoes in-app |
| API Gateway (placeholder) | `api_gateway` | 8000 | Registro estatico dos servicos para o MVP |

> Todos os servicos usam SQLite como persistencia padrao, criando arquivos `.db` locais quando iniciados.

## Pre-requisitos

- Python 3.12+
- Ambiente virtual ativo (recomendado)
- Dependencias instaladas via `pip install -r requirements.txt`

## Passos rapidos

```bash
python -m venv .venv
.venv\Scripts\activate               # Windows
# source .venv/bin/activate          # Linux/macOS
pip install -r requirements.txt
```

Em seguida, para iniciar cada servico:

```bash
# 1. Auth
cd backend/auth_svc
uvicorn app.main:app --reload --port 8001

# 2. Profiles
cd ../profiles_svc
uvicorn app.main:app --reload --port 8002

# 3. Projects
cd ../projects_svc
uvicorn app.main:app --reload --port 8003

# 4. Applications
cd ../applications_svc
uvicorn app.main:app --reload --port 8004

# 5. Match (mock)
cd ../match_svc
uvicorn app.main:app --reload --port 8005

# 6. Notifications (mock)
cd ../notifications_svc
uvicorn app.main:app --reload --port 8006

# 7. API Gateway (opcional)
cd ../api_gateway
uvicorn app.main:app --reload --port 8000
```

Cada API expoe documentacao Swagger em `/docs` na respectiva porta.

## Variaveis de ambiente

| Servico | Variavel | Descricao | Valor padrao |
|---------|----------|-----------|--------------|
| Auth | `AUTH_DATABASE_URL` | String de conexao para o banco | `sqlite:///./auth.db` |
| Auth | `AUTH_SECRET_KEY` | Chave usada na assinatura JWT | `super-secret-key-change-me` |
| Profiles | `PROFILES_DATABASE_URL` | Banco de perfis | `sqlite:///./profiles.db` |
| Projects | `PROJECTS_DATABASE_URL` | Banco de projetos | `sqlite:///./projects.db` |
| Applications | `APPLICATIONS_DATABASE_URL` | Banco de candidaturas | `sqlite:///./applications.db` |
| Match | `MATCH_API_PREFIX` | Ajuste do prefixo (opcional) | `/match` |
| Notifications | `NOTIFICATIONS_API_PREFIX` | Ajuste do prefixo (opcional) | `/notifications` |
| Gateway | `GATEWAY_API_PREFIX` | Ajuste do prefixo (opcional) | `/gateway` |

Crie um arquivo `.env` em cada pasta caso deseje sobrescrever os valores padrao.

## Postman Collection

- Arquivo: `postman/microservices.postman_collection.json`
- Variaveis internas apontam para as portas listadas acima.
- Depois de gerar o token no `auth-svc`, preencha a variavel `auth_token` na colecao para acionar `/auth/me`.
- Headers `X-User-Id` simulam a passagem de identidade entre servicos ate que a integracao com JWT esteja concluida.

## Testes Automatizados

Para executar todas as suites:

```bash
.venv\Scripts\activate                # caso ainda nao esteja ativo
python -m pytest backend
```

Cada arquivo de teste valida um fluxo-central do microservico correspondente:

- `auth_svc/tests/test_auth.py`  
  - Cria novo usuario via `/auth/register` e verifica a resposta.  
  - Gera token com `/auth/token` e usa o JWT em `/auth/me`.  
  - Repete o registro para garantir que e-mails duplicados retornem HTTP 400.
- `profiles_svc/tests/test_profiles.py`  
  - Usa `X-User-Id` para criar perfil, atualizar headline e recuperar dados.  
  - Adiciona/remover habilidades, interesses e itens de portfolio validando cada status HTTP.  
  - Confere se as listas sao atualizadas corretamente apos cada operacao.
- `projects_svc/tests/test_projects.py`  
  - Cria projeto associado ao owner (`X-User-Id`), lista e filtra por tag.  
  - Atualiza slots/work_mode e garante persistencia nas respostas.  
  - Remove o projeto e confirma lista vazia.
- `applications_svc/tests/test_applications.py`  
  - Envia candidatura com `/applications`, valida status SUBMITTED.  
  - Consulta `/applications/me` para checar agregacao do colaborador.  
  - Atualiza status (PATCH) e garante mudanca para REVIEWING.
- `match_svc/tests/test_match.py`  
  - Consulta recomendacoes mockadas e garante estrutura de dados esperada (IDs e lista de recomendacoes).
- `notifications_svc/tests/test_notifications.py`  
  - Envia notificacao de email e in-app; ambas respondem 202 com estado `queued`.
- `api_gateway/tests/test_gateway.py`  
  - Verifica se `/gateway/services` retorna o mapa de URLs configurado.  
  - Valida status do gateway (`/gateway/status`) com timestamp e lista monitorada.

## Rodando todos os microsservicos de uma vez

Para testar o frontend contra todo o backend local, use o script auxiliar:

```bash
.venv\Scripts\activate
python backend/run_all_services.py       # inicia todos os serviços com --reload
# python backend/run_all_services.py --no-reload   # inicia sem auto-reload
```

O script sobe Auth (8001), Profiles (8002), Projects (8003), Applications (8004),
Match (8005), Notifications (8006) e o API Gateway (8000) em paralelo usando Uvicorn.
Pressione `Ctrl+C` para encerrar todos os processos de uma vez.

## Proximos passos sugeridos

1. Adicionar Docker Compose orquestrando todos os servicos e bancos.
2. Integrar o `auth-svc` com os demais servicos (substituir `X-User-Id` por validacao JWT).
3. Criar testes automatizados por servico (pytest) e pipelines de CI.
4. Evoluir `match_svc` e `notifications_svc` alem da camada mock.
