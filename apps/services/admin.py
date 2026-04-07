from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import ServiceType


@admin.register(ServiceType)
class ServiceTypeAdmin(TranslationAdmin):
    list_display  = ["name", "is_active"]
    list_filter   = ["is_active"]
    list_editable = ["is_active"]