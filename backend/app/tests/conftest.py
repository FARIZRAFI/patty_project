import pytest
from app.tests.db import reset_test_db, engine, TestingSessionLocal, client


@pytest.fixture(autouse=True)
def setup_test_db():
    reset_test_db()
    yield
