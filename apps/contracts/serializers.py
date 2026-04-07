from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import Contract, Subscription


class ContractSerializer(serializers.ModelSerializer):
    company_name     = serializers.CharField(source="company.name", read_only=True)
    is_expiring_soon = serializers.BooleanField(read_only=True)

    class Meta:
        model  = Contract
        fields = [
            "id", "company", "company_name", "start_date", "end_date",
            "value", "status", "file", "notes",
            "is_expiring_soon", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs):
        if attrs.get("end_date") and attrs.get("start_date"):
            if attrs["end_date"] <= attrs["start_date"]:
                raise serializers.ValidationError({"end_date": _("End date must be after start date.")})
        return attrs


class SubscriptionSerializer(serializers.ModelSerializer):
    company_name      = serializers.CharField(source="company.name", read_only=True)
    service_type_name = serializers.CharField(source="service_type.name", read_only=True)

    class Meta:
        model  = Subscription
        fields = [
            "id", "company", "company_name", "contract", "service_type",
            "service_type_name", "price", "billing_cycle",
            "next_billing_date", "status", "created_at",
        ]
        read_only_fields = ["id", "created_at"]