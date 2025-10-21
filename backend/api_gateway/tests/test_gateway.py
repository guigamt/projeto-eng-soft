import pytest


@pytest.mark.asyncio
async def test_list_registered_services(client):
    response = await client.get("/gateway/services")
    assert response.status_code == 200
    services = response.json()
    assert "auth" in services
    assert services["profiles"].startswith("http://")


@pytest.mark.asyncio
async def test_gateway_status(client):
    response = await client.get("/gateway/status")
    assert response.status_code == 200
    data = response.json()
    assert "services_monitored" in data
    assert "timestamp" in data
