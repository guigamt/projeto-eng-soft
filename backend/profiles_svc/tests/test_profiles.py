import pytest


@pytest.mark.asyncio
async def test_profile_lifecycle(client):
    headers = {"X-User-Id": "1"}
    payload = {
        "headline": "Product Designer",
        "bio": "Colaborador focado em UX.",
        "location_city": "Sao Paulo",
        "location_state": "SP",
        "availability_hours_per_week": 20,
        "work_mode": "REMOTE",
    }

    create_response = await client.post(
        "/api/profiles/collaborators", json=payload, headers=headers
    )
    assert create_response.status_code == 201
    created = create_response.json()
    assert created["headline"] == payload["headline"]
    assert created["user_id"] == 1

    get_response = await client.get("/api/profiles/collaborators/me", headers=headers)
    assert get_response.status_code == 200
    fetched = get_response.json()
    assert fetched["bio"] == payload["bio"]

    update_payload = {"headline": "Lead Designer"}
    update_response = await client.put(
        "/api/profiles/collaborators/me", json=update_payload, headers=headers
    )
    assert update_response.status_code == 200
    assert update_response.json()["headline"] == "Lead Designer"

    skill_payload = {"name": "Figma", "level": 4}
    skill_response = await client.post(
        "/api/profiles/collaborators/me/skills", json=skill_payload, headers=headers
    )
    assert skill_response.status_code == 201
    skill_id = skill_response.json()["id"]

    interest_payload = {"slug": "ux", "label": "UX"}
    interest_response = await client.post(
        "/api/profiles/collaborators/me/interests",
        json=interest_payload,
        headers=headers,
    )
    assert interest_response.status_code == 201
    interest_id = interest_response.json()["id"]

    portfolio_payload = {
        "title": "Case Study",
        "url": "https://example.com",
        "description": "Estudo de caso UX.",
    }
    portfolio_response = await client.post(
        "/api/profiles/collaborators/me/portfolio",
        json=portfolio_payload,
        headers=headers,
    )
    assert portfolio_response.status_code == 201
    portfolio_id = portfolio_response.json()["id"]

    delete_skill = await client.delete(
        f"/api/profiles/collaborators/me/skills/{skill_id}", headers=headers
    )
    assert delete_skill.status_code == 204

    delete_interest = await client.delete(
        f"/api/profiles/collaborators/me/interests/{interest_id}", headers=headers
    )
    assert delete_interest.status_code == 204

    delete_portfolio = await client.delete(
        f"/api/profiles/collaborators/me/portfolio/{portfolio_id}",
        headers=headers,
    )
    assert delete_portfolio.status_code == 204
