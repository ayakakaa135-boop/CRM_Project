import pytest
from rest_framework.test import APIClient
from tests.factories import UserFactory, CompanyFactory


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def admin_user(db):
    return UserFactory(role="admin")


@pytest.fixture
def manager_user(db):
    return UserFactory(role="manager")


@pytest.fixture
def employee_user(db):
    return UserFactory(role="employee")


@pytest.fixture
def admin_client(api_client, admin_user):
    api_client.force_authenticate(user=admin_user)
    return api_client


@pytest.fixture
def manager_client(api_client, manager_user):
    api_client.force_authenticate(user=manager_user)
    return api_client


@pytest.fixture
def employee_client(api_client, employee_user):
    api_client.force_authenticate(user=employee_user)
    return api_client


@pytest.fixture
def company(db):
    return CompanyFactory()