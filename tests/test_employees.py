import pytest
from django.urls import reverse
from tests.factories import (
    CommissionFactory, EmployeeRequestFactory,
    UserFactory, CompanyFactory,
)


@pytest.mark.django_db
class TestCommission:

    def test_manager_can_create_commission(self, manager_client):
        employee = UserFactory(role="employee")
        company  = CompanyFactory()
        url = reverse("commission-list")
        res = manager_client.post(url, {
            "employee": employee.pk,
            "company":  company.pk,
            "amount":   "1500.00",
            "date":     "2025-01-10",
            "status":   "pending",
        })
        assert res.status_code == 201

    def test_filter_pending_commissions(self, manager_client):
        CommissionFactory(status="pending")
        CommissionFactory(status="paid")
        url = reverse("commission-list") + "?status=pending"
        res = manager_client.get(url)
        assert res.status_code == 200
        assert all(c["status"] == "pending" for c in res.data["results"])

    def test_employee_cannot_create_commission(self, employee_client):
        company = CompanyFactory()
        url = reverse("commission-list")
        res = employee_client.post(url, {
            "company": company.pk,
            "amount":  "500.00",
            "date":    "2025-01-10",
        })
        assert res.status_code == 403


@pytest.mark.django_db
class TestEmployeeRequest:

    def test_employee_can_create_request(self, employee_client, employee_user):
        url = reverse("request-list")
        res = employee_client.post(url, {
            "request_type": "leave",
            "description":  "أحتاج إجازة لأسباب عائلية",
        })
        assert res.status_code == 201
        assert res.data["employee"] == employee_user.pk

    def test_employee_sees_only_own_requests(self, employee_client, employee_user):
        EmployeeRequestFactory(employee=employee_user)
        EmployeeRequestFactory()  # طلب موظف آخر
        url = reverse("request-list")
        res = employee_client.get(url)
        assert res.status_code == 200
        assert res.data["count"] == 1

    def test_manager_can_review_request(self, manager_client):
        request = EmployeeRequestFactory()
        url = reverse("request-review", kwargs={"pk": request.pk})
        res = manager_client.patch(url, {"status": "approved"})
        assert res.status_code == 200

    def test_employee_cannot_review(self, employee_client):
        request = EmployeeRequestFactory()
        url = reverse("request-review", kwargs={"pk": request.pk})
        res = employee_client.patch(url, {"status": "approved"})
        assert res.status_code == 403