import pytest


@pytest.mark.asyncio
async def test_application_flow(client):
    headers = {"X-User-Id": "5"}
    payload = {"project_id": 999, "pitch": "Tenho experiencia em IA aplicada."}

    create_response = await client.post(
        "/applications", json=payload, headers=headers
    )
    assert create_response.status_code == 201
    application = create_response.json()
    application_id = application["id"]
    assert application["collaborator_id"] == 5
    assert application["status"] == "SUBMITTED"

    list_response = await client.get("/applications/me", headers=headers)
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    update_payload = {"status": "REVIEWING"}
    update_response = await client.patch(
        f"/applications/{application_id}", json=update_payload
    )
    assert update_response.status_code == 200
    assert update_response.json()["status"] == "REVIEWING"
