import pytest


@pytest.mark.asyncio
async def test_recommendations_for_collaborator(client):
    response = await client.get("/match/recommendations/collaborators/1")
    assert response.status_code == 200
    data = response.json()
    assert data["collaborator_id"] == 1
    assert "recommendations" in data
    assert isinstance(data["recommendations"], list)
