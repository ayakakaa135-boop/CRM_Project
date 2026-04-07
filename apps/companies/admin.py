from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from modeltranslation.admin import TranslationAdmin
from .models import Company


@admin.register(Company)
class CompanyAdmin(TranslationAdmin):
    list_display   = ["name", "cr_number", "status", "phone", "email"]
    list_filter    = ["status"]
    search_fields  = ["name", "cr_number", "email"]
    list_editable  = ["status"]