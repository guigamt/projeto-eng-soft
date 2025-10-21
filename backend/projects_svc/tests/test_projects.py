import pytest


@pytest.mark.asyncio
async def test_project_crud_flow(client):
    headers = {"X-User-Id": "10"}
    payload = {
        "name": "Dashboard Sustentavel",
        "headline": "Insights ESG",
        "description": "Projeto para reduzir pegada de carbono.",
        "tags": ["sustentabilidade", "datascience"],
        "slots": 3,
        "work_mode": "REMOTE",
        "remote": True,
    }

    create_response = await client.post("/projects", json=payload, headers=headers)
    assert create_response.status_code == 201
    project = create_response.json()
    project_id = project["id"]
    assert project["owner_id"] == 10

    list_response = await client.get("/projects")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    filtered_response = await client.get("/projects", params={"tag": "datascience"})
    assert filtered_response.status_code == 200
    assert len(filtered_response.json()) == 1

    update_payload = {"slots": 5, "work_mode": "HYBRID"}
    update_response = await client.put(
        f"/projects/{project_id}", json=update_payload, headers=headers
    )
    assert update_response.status_code == 200
    assert update_response.json()["slots"] == 5
    assert update_response.json()["work_mode"] == "HYBRID"

    delete_response = await client.delete(
        f"/projects/{project_id}", headers=headers
    )
    assert delete_response.status_code == 204

    empty_response = await client.get("/projects")
    assert empty_response.status_code == 200
    assert empty_response.json() == []
