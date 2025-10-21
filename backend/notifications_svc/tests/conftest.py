from collections.abc import AsyncIterator
import sys
from pathlib import Path

SERVICE_PATH = Path(__file__).resolve().parents[1]
if str(SERVICE_PATH) not in sys.path:
    sys.path.insert(0, str(SERVICE_PATH))

for module_name in list(sys.modules):
    if module_name == "app" or module_name.startswith("app."):
        sys.modules.pop(module_name)

import pytest
import pytest_asyncio
from httpx import AsyncClient

from app.main import create_app


@pytest.fixture(scope="module")
def app():
    return create_app()


@pytest_asyncio.fixture
async def client(app) -> AsyncIterator[AsyncClient]:
    async with AsyncClient(app=app, base_url="http://testserver") as async_client:
        yield async_client
