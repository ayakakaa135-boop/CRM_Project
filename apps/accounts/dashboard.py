from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from django.utils.translation import gettext_lazy as _
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.accounts.permissions import IsAdminOrManager
from apps.companies.models import Company
from apps.contracts.models import Contract, Subscription
from apps.finance.models import ReceiptVoucher, PaymentVoucher
from apps.employees.models import Commission, EmployeeRequest
from apps.reports.models import ServiceReport


@api_view(["GET"])
@permission_classes([IsAdminOrManager])
def dashboard_stats(request):
    """GET /api/v1/dashboard/ — إحصائيات لوحة التحكم."""
    today = timezone.now().date()
    month_start = today.replace(day=1)

    stats = {
        "companies": {
            "total":    Company.objects.count(),
            "active":   Company.objects.filter(status="active").count(),
        },
        "contracts": {
            "total":         Contract.objects.count(),
            "active":        Contract.objects.filter(status="active").count(),
            "expiring_soon": Contract.objects.filter(
                status="active",
                end_date__lte=today + timedelta(days=7)
            ).count(),
        },
        "finance": {
            "receipts_this_month": ReceiptVoucher.objects.filter(
                date__gte=month_start
            ).aggregate(total=Sum("amount"))["total"] or 0,
            "payments_this_month": PaymentVoucher.objects.filter(
                date__gte=month_start
            ).aggregate(total=Sum("amount"))["total"] or 0,
        },
        "reports": {
            "total":     ServiceReport.objects.count(),
            "published": ServiceReport.objects.filter(status="published").count(),
            "shared":    ServiceReport.objects.filter(is_shared=True).count(),
        },
        "commissions": {
            "pending": Commission.objects.filter(status="pending")
                                         .aggregate(total=Sum("amount"))["total"] or 0,
        },
        "employee_requests": {
            "pending": EmployeeRequest.objects.filter(status="pending").count(),
        },
    }
    return Response(stats)