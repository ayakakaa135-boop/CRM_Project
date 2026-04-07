from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from .models import ServiceReport, ReportItem


class ReportItemSerializer(serializers.ModelSerializer):
    service_type_name = serializers.CharField(source="service_type.name", read_only=True)

    class Meta:
        model  = ReportItem
        fields = ["id", "service_type", "service_type_name", "description", "notes"]


class ServiceReportSerializer(serializers.ModelSerializer):
    items              = ReportItemSerializer(many=True)
    company_name       = serializers.CharField(source="company.name", read_only=True)
    created_by_name    = serializers.CharField(source="created_by.get_full_name", read_only=True)
    share_url          = serializers.SerializerMethodField()

    class Meta:
        model  = ServiceReport
        fields = [
            "id", "company", "company_name", "created_by", "created_by_name",
            "date", "status", "share_token", "is_shared", "share_url",
            "notes", "items", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "share_token", "created_by", "created_at", "updated_at"]

    def get_share_url(self, obj):
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.get_share_url())
        return None

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        report = ServiceReport.objects.create(
            **validated_data,
            created_by=self.context["request"].user,
        )
        for item in items_data:
            ReportItem.objects.create(report=report, **item)
        # trigger PDF generation
        from apps.reports.tasks import generate_report_pdf
        generate_report_pdf.delay(report.id)
        return report

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()
            for item in items_data:
                ReportItem.objects.create(report=instance, **item)
        return instance


class ServiceReportListSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)

    class Meta:
        model  = ServiceReport
        fields = ["id", "company_name", "date", "status", "share_token", "is_shared", "created_at"]


class PublicReportSerializer(serializers.ModelSerializer):
    """نسخة عامة بدون بيانات حساسة — للرابط المشترك."""
    items        = ReportItemSerializer(many=True, read_only=True)
    company_name = serializers.CharField(source="company.name", read_only=True)

    class Meta:
        model  = ServiceReport
        fields = ["id", "company_name", "date", "status", "notes", "items"]
