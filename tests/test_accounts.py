import pytest
from django.urls import reverse
from tests.factories import UserFactory


@pytest.mark.django_db
class TestAuthEndpoints:

    def test_login_success(self, api_client, admin_user):
        url = reverse("auth-login")
        res = api_client.post(url, {
            "username": admin_user.username,
            "password": "testpass123",
        })
        assert res.status_code == 200
        assert "access" in res.data
        assert "refresh" in res.data
        assert res.data["user"]["role"] == "admin"

    def test_login_wrong_password(self, api_client, admin_user):
        url = reverse("auth-login")
        res = api_client.post(url, {
            "username": admin_user.username,
            "password": "wrongpassword",
        })
        assert res.status_code == 401

    def test_me_authenticated(self, admin_client, admin_user):
        url = reverse("auth-me")
        res = admin_client.get(url)
        assert res.status_code == 200
        assert res.data["username"] == admin_user.username

    def test_me_unauthenticated(self, api_client):
        url = reverse("auth-me")
        res = api_client.get(url)
        assert res.status_code == 401

    def test_change_password(self, admin_client):
        url = reverse("change-password")
        res = admin_client.put(url, {
            "old_password": "testpass123",
            "new_password": "NewSecure@456",
        })
        assert res.status_code == 200

    def test_change_password_wrong_old(self, admin_client):
        url = reverse("change-password")
        res = admin_client.put(url, {
            "old_password": "wrongpass",
            "new_password": "NewSecure@456",
        })
        assert res.status_code == 400


@pytest.mark.django_db
class TestUserManagement:

    def test_admin_can_list_users(self, admin_client):
        UserFactory.create_batch(3)
        url = reverse("user-list")
        res = admin_client.get(url)
        assert res.status_code == 200
        assert res.data["count"] >= 3

    def test_employee_cannot_list_users(self, employee_client):
        url = reverse("user-list")
        res = employee_client.get(url)
        assert res.status_code == 403

    def test_admin_can_create_user(self, admin_client):
        url = reverse("user-list")
        res = admin_client.post(url, {
            "username":  "newuser",
            "email":     "newuser@example.com",
            "password":  "StrongPass@123",
            "password2": "StrongPass@123",
            "role":      "employee",
        })
        assert res.status_code == 201

    def test_password_mismatch(self, admin_client):
        url = reverse("user-list")
        res = admin_client.post(url, {
            "username":  "newuser2",
            "password":  "StrongPass@123",
            "password2": "DifferentPass@123",
            "role":      "employee",
        })
        assert res.status_code == 400