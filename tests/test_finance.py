import pytest
from django.urls import reverse
from tests.factories import (
    ReceiptVoucherFactory, PaymentVoucherFactory,
    CompanyFactory, UserFactory,
)


@pytest.mark.django_db
class TestReceiptVoucher:

    def test_create_receipt(self, manager_client):
        company = CompanyFactory()
        url = reverse("receipt-list")
        res = manager_client.post(url, {
            "company":        company.pk,
            "amount":         "5000.00",
            "date":           "2025-01-15",
            "payment_method": "bank_transfer",
        })
        assert res.status_code == 201
        assert res.data["amount"] == "5000.00"

    def test_created_by_auto_set(self, manager_client, manager_user):
        company = CompanyFactory()
        url = reverse("receipt-list")
        res = manager_client.post(url, {
            "company": company.pk,
            "amount":  "1000.00",
            "date":    "2025-01-15",
        })
        assert res.status_code == 201
        assert res.data["created_by"] == manager_user.pk

    def test_employee_cannot_create_receipt(self, employee_client):
        company = CompanyFactory()
        url = reverse("receipt-list")
        res = employee_client.post(url, {
            "company": company.pk,
            "amount":  "1000.00",
            "date":    "2025-01-15",
        })
        assert res.status_code == 403


@pytest.mark.django_db
class TestPaymentVoucher:

    def test_create_payment(self, manager_client):
        employee = UserFactory(role="employee")
        url = reverse("payment-list")
        res = manager_client.post(url, {
            "voucher_type":   "salary",
            "employee":       employee.pk,
            "amount":         "8000.00",
            "date":           "2025-01-31",
            "payment_method": "bank_transfer",
        })
        assert res.status_code == 201

    def test_filter_by_type(self, manager_client):
        PaymentVoucherFactory(voucher_type="salary")
        PaymentVoucherFactory(voucher_type="expense")
        url = reverse("payment-list") + "?voucher_type=salary"
        res = manager_client.get(url)
        assert res.status_code == 200
        assert all(v["voucher_type"] == "salary" for v in res.data["results"])