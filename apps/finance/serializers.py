from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import ReceiptVoucher, PaymentVoucher


class ReceiptVoucherSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)
    created_by_name = serializers.CharField(source="created_by.get_full_name", read_only=True)

    class Meta:
        model  = ReceiptVoucher
        fields = [
            "id", "company", "company_name", "subscription", "amount",
            "date", "payment_method", "reference", "notes",
            "created_by", "created_by_name", "created_at",
        ]
        read_only_fields = ["id", "created_by", "created_at"]

    def create(self, validated_data):
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)


class PaymentVoucherSerializer(serializers.ModelSerializer):
    employee_name   = serializers.CharField(source="employee.get_full_name", read_only=True)
    created_by_name = serializers.CharField(source="created_by.get_full_name", read_only=True)

    class Meta:
        model  = PaymentVoucher
        fields = [
            "id", "voucher_type", "employee", "employee_name",
            "amount", "date", "payment_method", "reference", "notes",
            "created_by", "created_by_name", "created_at",
        ]
        read_only_fields = ["id", "created_by", "created_at"]

    def create(self, validated_data):
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)