import pytest


@pytest.mark.asyncio
async def test_register_login_and_me(client):
    register_payload = {
        "email": "tester@example.com",
        "password": "supersecret",
        "full_name": "Tester",
        "role": "COLLABORATOR",
    }

    response = await client.post("/auth/register", json=register_payload)
    assert response.status_code == 201
    body = response.json()
    assert body["email"] == register_payload["email"]
    assert body["full_name"] == register_payload["full_name"]
    assert body["role"] == "COLLABORATOR"

    token_response = await client.post(
        "/auth/token",
        data={"username": register_payload["email"], "password": register_payload["password"]},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert token_response.status_code == 200
    access_token = token_response.json()["access_token"]

    me_response = await client.get(
        "/auth/me", headers={"Authorization": f"Bearer {access_token}"}
    )
    assert me_response.status_code == 200
    me_body = me_response.json()
    assert me_body["email"] == register_payload["email"]


@pytest.mark.asyncio
async def test_register_duplicate_email_is_rejected(client):
    payload = {
        "email": "duplicate@example.com",
        "password": "testpass",
        "full_name": "Dup",
    }
    first = await client.post("/auth/register", json=payload)
    assert first.status_code == 201

    second = await client.post("/auth/register", json=payload)
    assert second.status_code == 400
    assert second.json()["detail"] == "Email already registered."
