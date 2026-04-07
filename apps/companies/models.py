from django.db import models
from django.utils.translation import gettext_lazy as _


class Company(models.Model):
    class Status(models.TextChoices):
        ACTIVE   = "active",   _("Active")
        INACTIVE = "inactive", _("Inactive")
        SUSPENDED = "suspended", _("Suspended")

    # translatable — modeltranslation يضيف name_ar / name_en تلقائياً
    name       = models.CharField(_("Name"), max_length=255)
    cr_number  = models.CharField(_("CR Number"), max_length=50, unique=True)
    email      = models.EmailField(_("Email"), blank=True)
    phone      = models.CharField(_("Phone"), max_length=20, blank=True)
    address    = models.TextField(_("Address"), blank=True)
    status     = models.CharField(_("Status"), max_length=20, choices=Status.choices, default=Status.ACTIVE)
    notes      = models.TextField(_("Notes"), blank=True)  # translatable
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = _("Company")
        verbose_name_plural = _("Companies")
        ordering            = ["name"]

    def __str__(self):
        return self.name