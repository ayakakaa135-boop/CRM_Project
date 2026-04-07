import pytest
from django.urls import reverse
from tests.factories import CompanyFactory, ContractFactory, ReceiptVoucherFactory


@pytest.mark.django_db
class TestDashboard:

    def test_admin_can_access(self, admin_client):
        url = reverse("dashboard")
        res = admin_client.get(url)
        assert res.status_code == 200
        assert "companies" in res.data
        assert "finance" in res.data
        assert "contracts" in res.data

    def test_employee_cannot_access(self, employee_client):
        url = reverse("dashboard")
        res = employee_client.get(url)
        assert res.status_code == 403

    def test_stats_accuracy(self, admin_client):
        CompanyFactory.create_batch(3, status="active")
        CompanyFactory(status="inactive")
        url = reverse("dashboard")
        res = admin_client.get(url)
        assert res.data["companies"]["active"] == 3
        assert res.data["companies"]["total"] == 4