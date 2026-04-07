from django.urls import path
from .views import (
    ReceiptVoucherListCreateView, ReceiptVoucherDetailView,
    PaymentVoucherListCreateView, PaymentVoucherDetailView,
)

urlpatterns = [
    path("receipts/",            ReceiptVoucherListCreateView.as_view(),  name="receipt-list"),
    path("receipts/<int:pk>/",   ReceiptVoucherDetailView.as_view(),       name="receipt-detail"),
    path("payments/",            PaymentVoucherListCreateView.as_view(),   name="payment-list"),
    path("payments/<int:pk>/",   PaymentVoucherDetailView.as_view(),       name="payment-detail"),
]