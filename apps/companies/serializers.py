from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Company
        fields = [
            "id", "name", "cr_number", "email", "phone",
            "address", "status", "notes", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class CompanyListSerializer(serializers.ModelSerializer):
    """نسخة مختصرة للقوائم."""
    class Meta:
        model  = Company
        fields = ["id", "name", "cr_number", "status", "phone"]