from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display  = ["username", "email", "role", "phone", "is_active"]
    list_filter   = ["role", "is_active"]
    search_fields = ["username", "email", "first_name", "last_name", "phone"]

    fieldsets = UserAdmin.fieldsets + (
        (_("CRM Info"), {"fields": ("role", "phone", "avatar")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (_("CRM Info"), {"fields": ("role", "phone")}),
    )