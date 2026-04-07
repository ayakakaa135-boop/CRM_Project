from rest_framework import generics, filters, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

from apps.accounts.permissions import IsAdminOrManager
from .models import Commission, EmployeeRequest
from .serializers import CommissionSerializer, EmployeeRequestSerializer, ReviewRequestSerializer
from .tasks import link_commission_to_voucher


class CommissionListCreateView(generics.ListCreateAPIView):
    serializer_class   = CommissionSerializer
    permission_classes = [IsAdminOrManager]
    filter_backends    = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields   = ["status", "employee", "company"]
    ordering_fields    = ["date", "amount"]

    def get_queryset(self):
        return Commission.objects.select_related("employee", "company")


class CommissionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Commission.objects.select_related("employee", "company")
    serializer_class   = CommissionSerializer
    permission_classes = [IsAdminOrManager]

    def perform_update(self, serializer):
        instance = serializer.save()
        # إذا ربطنا عمولة بسند صرف — نطلق الـ task
        if instance.payment_voucher and instance.status == "paid":
            link_commission_to_voucher.delay(instance.id, instance.payment_voucher.id)


class EmployeeRequestListCreateView(generics.ListCreateAPIView):
    serializer_class   = EmployeeRequestSerializer
    filter_backends    = [DjangoFilterBackend]
    filterset_fields   = ["status", "request_type"]

    def get_queryset(self):
        user = self.request.user
        qs   = EmployeeRequest.objects.select_related("employee", "reviewed_by")
        if user.is_employee:
            return qs.filter(employee=user)
        return qs

    def get_permissions(self):
        from rest_framework.permissions import IsAuthenticated
        return [IsAuthenticated()]


class EmployeeRequestDetailView(generics.RetrieveAPIView):
    serializer_class = EmployeeRequestSerializer

    def get_queryset(self):
        user = self.request.user
        qs   = EmployeeRequest.objects.select_related("employee")
        if user.is_employee:
            return qs.filter(employee=user)
        return qs

    def get_permissions(self):
        from rest_framework.permissions import IsAuthenticated
        return [IsAuthenticated()]


class ReviewRequestView(generics.UpdateAPIView):
    """PATCH /api/v1/employees/requests/<pk>/review/ — مراجعة الطلب (مدير/أدمن)."""
    queryset           = EmployeeRequest.objects.all()
    serializer_class   = ReviewRequestSerializer
    permission_classes = [IsAdminOrManager]