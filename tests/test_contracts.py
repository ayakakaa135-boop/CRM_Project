import pytest
from django.urls import reverse
from django.utils import timezone
from tests.factories import ContractFactory, CompanyFactory, SubscriptionFactory, ServiceTypeFactory


@pytest.mark.django_db
class TestContractEndpoints:

    def test_create_contract(self, manager_client):
        company = CompanyFactory()
        url = reverse("contract-list")
        res = manager_client.post(url, {
            "company":    company.pk,
            "start_date": "2025-01-01",
            "end_date":   "2026-01-01",
            "value":      "50000.00",
            "status":     "active",
        })
        assert res.status_code == 201

    def test_end_date_before_start(self, manager_client):
        company = CompanyFactory()
        url = reverse("contract-list")
        res = manager_client.post(url, {
            "company":    company.pk,
            "start_date": "2025-06-01",
            "end_date":   "2025-01-01",   # قبل البداية
            "value":      "1000.00",
        })
        assert res.status_code == 400

    def test_expiring_soon_flag(self, manager_client):
        today   = timezone.now().date()
        company = CompanyFactory()
        contract = ContractFactory(
            company=company,
            end_date=today + timezone.timedelta(days=3),
            status="active",
        )
        url = reverse("contract-detail", kwargs={"pk": contract.pk})
        res = manager_client.get(url)
        assert res.status_code == 200
        assert res.data["is_expiring_soon"] is True


@pytest.mark.django_db
class TestSubscriptionEndpoints:

    def test_create_subscription(self, manager_client):
        company      = CompanyFactory()
        service_type = ServiceTypeFactory()
        contract     = ContractFactory(company=company)
        url = reverse("subscription-list")
        res = manager_client.post(url, {
            "company":           company.pk,
            "contract":          contract.pk,
            "service_type":      service_type.pk,
            "price":             "1500.00",
            "billing_cycle":     "monthly",
            "next_billing_date": "2025-02-01",
            "status":            "active",
        })
        assert res.status_code == 201

    def test_filter_by_status(self, manager_client):
        SubscriptionFactory(status="active")
        SubscriptionFactory(status="cancelled")
        url = reverse("subscription-list") + "?status=active"
        res = manager_client.get(url)
        assert res.status_code == 200
        assert all(s["status"] == "active" for s in res.data["results"])