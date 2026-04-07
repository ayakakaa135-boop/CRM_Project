from rest_framework import serializers
from .models import ServiceType


class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ServiceType
        fields = ["id", "name", "description", "is_active", "created_at"]
        read_only_fields = ["id", "created_at"]