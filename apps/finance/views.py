from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from apps.accounts.permissions import IsAdminOrManager
from .models import ReceiptVoucher, PaymentVoucher
from .serializers import ReceiptVoucherSerializer, PaymentVoucherSerializer


class ReceiptVoucherListCreateView(generics.ListCreateAPIView):
    queryset           = ReceiptVoucher.objects.select_related("company", "created_by", "subscription")
    serializer_class   = ReceiptVoucherSerializer
    permission_classes = [IsAdminOrManager]
    filter_backends    = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields   = ["company", "payment_method", "date"]
    ordering_fields    = ["date", "amount"]


class ReceiptVoucherDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = ReceiptVoucher.objects.select_related("company")
    serializer_class   = ReceiptVoucherSerializer
    permission_classes = [IsAdminOrManager]


class PaymentVoucherListCreateView(generics.ListCreateAPIView):
    queryset           = PaymentVoucher.objects.select_related("employee", "created_by")
    serializer_class   = PaymentVoucherSerializer
    permission_classes = [IsAdminOrManager]
    filter_backends    = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields   = ["voucher_type", "employee", "date"]
    ordering_fields    = ["date", "amount"]


class PaymentVoucherDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = PaymentVoucher.objects.select_related("employee")
    serializer_class   = PaymentVoucherSerializer
    permission_classes = [IsAdminOrManager]