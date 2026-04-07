import pytest
from django.urls import reverse
from tests.factories import CompanyFactory


@pytest.mark.django_db
class TestCompanyEndpoints:

    def test_list_companies(self, manager_client):
        CompanyFactory.create_batch(5)
        url = reverse("company-list")
        res = manager_client.get(url)
        assert res.status_code == 200
        assert res.data["count"] == 5

    def test_create_company(self, manager_client):
        url = reverse("company-list")
        res = manager_client.post(url, {
            "name":      "شركة الاختبار",
            "cr_number": "1234567890",
            "email":     "test@company.com",
            "status":    "active",
        })
        assert res.status_code == 201
        assert res.data["name"] == "شركة الاختبار"

    def test_duplicate_cr_number(self, manager_client, company):
        url = reverse("company-list")
        res = manager_client.post(url, {
            "name":      "شركة أخرى",
            "cr_number": company.cr_number,  # مكرر
        })
        assert res.status_code == 400

    def test_retrieve_company(self, manager_client, company):
        url = reverse("company-detail", kwargs={"pk": company.pk})
        res = manager_client.get(url)
        assert res.status_code == 200
        assert res.data["id"] == company.pk

    def test_update_company(self, manager_client, company):
        url = reverse("company-detail", kwargs={"pk": company.pk})
        res = manager_client.patch(url, {"status": "inactive"})
        assert res.status_code == 200
        assert res.data["status"] == "inactive"

    def test_delete_company(self, admin_client, company):
        url = reverse("company-detail", kwargs={"pk": company.pk})
        res = admin_client.delete(url)
        assert res.status_code == 204

    def test_filter_by_status(self, manager_client):
        CompanyFactory(status="active")
        CompanyFactory(status="inactive")
        url = reverse("company-list") + "?status=active"
        res = manager_client.get(url)
        assert res.status_code == 200
        assert all(c["status"] == "active" for c in res.data["results"])

    def test_employee_cannot_access(self, employee_client):
        url = reverse("company-list")
        res = employee_client.get(url)
        assert res.status_code == 403