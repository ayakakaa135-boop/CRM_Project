from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.accounts.permissions import IsAdminOrManager
from .models import ServiceReport
from .serializers import (
    ServiceReportSerializer,
    ServiceReportListSerializer,
    PublicReportSerializer,
)


class ReportListCreateView(generics.ListCreateAPIView):
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields   = ["status", "company", "is_shared"]
    search_fields      = ["company__name", "notes"]
    ordering_fields    = ["date", "created_at"]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs   = ServiceReport.objects.select_related("company", "created_by")
        if user.is_employee:
            return qs.filter(created_by=user)
        return qs

    def get_serializer_class(self):
        return ServiceReportSerializer if self.request.method == "POST" else ServiceReportListSerializer


class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class   = ServiceReportSerializer
    permission_classes = [IsAdminOrManager]

    def get_queryset(self):
        return ServiceReport.objects.prefetch_related("items__service_type")


class ReportShareToggleView(generics.UpdateAPIView):
    """PATCH /api/v1/reports/<pk>/share/ — تفعيل/تعطيل المشاركة."""
    queryset           = ServiceReport.objects.all()
    permission_classes = [IsAdminOrManager]
    serializer_class   = ServiceReportSerializer

    def patch(self, request, pk):
        report = get_object_or_404(ServiceReport, pk=pk)
        report.is_shared = not report.is_shared
        report.save()
        return Response({
            "is_shared": report.is_shared,
            "share_url": request.build_absolute_uri(report.get_share_url())
                         if report.is_shared else None,
        })


@api_view(["GET"])
@permission_classes([AllowAny])
def public_report_view(request, token):
    """GET /api/v1/reports/share/<token>/ — عرض التقرير بدون login."""
    report = get_object_or_404(ServiceReport, share_token=token, is_shared=True)
    serializer = PublicReportSerializer(report)
    return Response(serializer.data)