from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from .models import Commission, EmployeeRequest


class CommissionSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.get_full_name", read_only=True)
    company_name  = serializers.CharField(source="company.name", read_only=True)

    class Meta:
        model  = Commission
        fields = [
            "id", "employee", "employee_name", "company", "company_name",
            "amount", "date", "status", "payment_voucher", "notes", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class EmployeeRequestSerializer(serializers.ModelSerializer):
    employee_name   = serializers.CharField(source="employee.get_full_name", read_only=True)
    reviewed_by_name = serializers.CharField(source="reviewed_by.get_full_name", read_only=True)

    class Meta:
        model  = EmployeeRequest
        fields = [
            "id", "employee", "employee_name", "request_type",
            "description", "status", "reviewed_by", "reviewed_by_name",
            "reviewed_at", "created_at",
        ]
        read_only_fields = ["id", "employee", "reviewed_by", "reviewed_at", "created_at"]

    def create(self, validated_data):
        validated_data["employee"] = self.context["request"].user
        return super().create(validated_data)


class ReviewRequestSerializer(serializers.ModelSerializer):
    """للمدير فقط — مراجعة الطلب."""
    class Meta:
        model  = EmployeeRequest
        fields = ["status"]

    def update(self, instance, validated_data):
        instance.status      = validated_data["status"]
        instance.reviewed_by = self.context["request"].user
        instance.reviewed_at = timezone.now()
        instance.save()
        return instance