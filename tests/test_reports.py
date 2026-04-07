import pytest
from django.urls import reverse
from tests.factories import (
    ServiceReportFactory, CompanyFactory,
    ServiceTypeFactory, UserFactory,
)


@pytest.mark.django_db
class TestReportEndpoints:

    def test_create_report(self, manager_client, manager_user):
        company      = CompanyFactory()
        service_type = ServiceTypeFactory()
        url = reverse("report-list")
        res = manager_client.post(url, {
            "company": company.pk,
            "date":    "2025-01-01",
            "status":  "draft",
            "items": [
                {
                    "service_type": service_type.pk,
                    "description":  "وصف الخدمة",
                    "notes":        "",
                }
            ],
        }, format="json")
        assert res.status_code == 201
        assert res.data["company"] == company.pk

    def test_share_token_generated(self, manager_client):
        company      = CompanyFactory()
        service_type = ServiceTypeFactory()
        url = reverse("report-list")
        res = manager_client.post(url, {
            "company": company.pk,
            "date":    "2025-01-01",
            "items":   [{"service_type": service_type.pk, "description": "test"}],
        }, format="json")
        assert res.status_code == 201
        assert res.data["share_token"] is not None

    def test_toggle_share(self, manager_client):
        report = ServiceReportFactory()
        url    = reverse("report-share-toggle", kwargs={"pk": report.pk})
        res    = manager_client.patch(url)
        assert res.status_code == 200
        assert res.data["is_shared"] is True
        # Toggle مرة ثانية
        res = manager_client.patch(url)
        assert res.data["is_shared"] is False

    def test_public_report_access(self, api_client):
        report = ServiceReportFactory(is_shared=True)
        url    = reverse("report-share", kwargs={"token": report.share_token})
        res    = api_client.get(url)
        assert res.status_code == 200
        assert "company_name" in res.data

    def test_public_report_not_shared(self, api_client):
        report = ServiceReportFactory(is_shared=False)
        url    = reverse("report-share", kwargs={"token": report.share_token})
        res    = api_client.get(url)
        assert res.status_code == 404

    def test_employee_sees_only_own_reports(self, employee_client, employee_user):
        ServiceReportFactory(created_by=employee_user)
        ServiceReportFactory()  # تقرير موظف آخر
        url = reverse("report-list")
        res = employee_client.get(url)
        assert res.status_code == 200
        assert res.data["count"] == 1