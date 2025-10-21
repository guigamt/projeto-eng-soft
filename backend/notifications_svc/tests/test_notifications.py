import pytest


@pytest.mark.asyncio
async def test_schedule_email_notification(client):
    payload = {"to": "user@example.com", "subject": "Convite", "body": "Mensagem."}
    response = await client.post("/notifications/email", json=payload)
    assert response.status_code == 202
    body = response.json()
    assert body["type"] == "email"
    assert body["status"] == "queued"


@pytest.mark.asyncio
async def test_schedule_in_app_notification(client):
    payload = {"user_id": 1, "message": "Nova candidatura recebida."}
    response = await client.post("/notifications/in-app", json=payload)
    assert response.status_code == 202
    body = response.json()
    assert body["type"] == "in-app"
    assert body["status"] == "queued"
