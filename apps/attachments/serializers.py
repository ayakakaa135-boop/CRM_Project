from django.contrib.contenttypes.models import ContentType
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from .models import Attachment


ALLOWED_MODELS = ["company", "contract", "subscription", "servicereport"]


class AttachmentSerializer(serializers.ModelSerializer):
    content_type_model  = serializers.CharField(write_only=True)
    uploaded_by_name    = serializers.CharField(source="uploaded_by.get_full_name", read_only=True)

    class Meta:
        model  = Attachment
        fields = [
            "id", "content_type_model", "object_id", "file",
            "name", "uploaded_by", "uploaded_by_name", "created_at",
        ]
        read_only_fields = ["id", "uploaded_by", "created_at"]

    def validate_content_type_model(self, value):
        if value.lower() not in ALLOWED_MODELS:
            raise serializers.ValidationError(
                _("Model '%(model)s' is not allowed.") % {"model": value}
            )
        return value.lower()

    def create(self, validated_data):
        model_name   = validated_data.pop("content_type_model")
        content_type = ContentType.objects.get(model=model_name)
        return Attachment.objects.create(
            content_type=content_type,
            uploaded_by=self.context["request"].user,
            **validated_data,
        )