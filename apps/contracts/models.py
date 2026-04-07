from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from apps.companies.models import Company
from apps.services.models import ServiceType


class Contract(models.Model):
    class Status(models.TextChoices):
        ACTIVE    = "active",    _("Active")
        EXPIRED   = "expired",   _("Expired")
        CANCELLED = "cancelled", _("Cancelled")
        PENDING   = "pending",   _("Pending")

    company    = models.ForeignKey(Company, on_delete=models.PROTECT,
                                   related_name="contracts", verbose_name=_("Company"))
    start_date = models.DateField(_("Start Date"))
    end_date   = models.DateField(_("End Date"))
    value      = models.DecimalField(_("Value"), max_digits=12, decimal_places=2)
    status     = models.CharField(_("Status"), max_length=20,
                                  choices=Status.choices, default=Status.PENDING)
    file       = models.FileField(_("File"), upload_to="contracts/", blank=True, null=True)
    notes      = models.TextField(_("Notes"), blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = _("Contract")
        verbose_name_plural = _("Contracts")
        ordering            = ["-start_date"]

    def __str__(self):
        return f"{self.company} ({self.start_date} → {self.end_date})"

    @property
    def is_expiring_soon(self):
        from datetime import timedelta
        return (
            self.status == self.Status.ACTIVE
            and self.end_date <= (timezone.now().date() + timedelta(days=7))
        )


class Subscription(models.Model):
    class BillingCycle(models.TextChoices):
        MONTHLY  = "monthly",  _("Monthly")
        QUARTERLY = "quarterly", _("Quarterly")
        YEARLY   = "yearly",   _("Yearly")

    class Status(models.TextChoices):
        ACTIVE    = "active",    _("Active")
        PAUSED    = "paused",    _("Paused")
        CANCELLED = "cancelled", _("Cancelled")

    company           = models.ForeignKey(Company, on_delete=models.PROTECT,
                                          related_name="subscriptions", verbose_name=_("Company"))
    contract          = models.ForeignKey(Contract, on_delete=models.PROTECT,
                                          related_name="subscriptions", verbose_name=_("Contract"),
                                          null=True, blank=True)
    service_type      = models.ForeignKey(ServiceType, on_delete=models.PROTECT,
                                          verbose_name=_("Service Type"))
    price             = models.DecimalField(_("Price"), max_digits=10, decimal_places=2)
    billing_cycle     = models.CharField(_("Billing Cycle"), max_length=20,
                                         choices=BillingCycle.choices, default=BillingCycle.MONTHLY)
    next_billing_date = models.DateField(_("Next Billing Date"))
    status            = models.CharField(_("Status"), max_length=20,
                                         choices=Status.choices, default=Status.ACTIVE)
    created_at        = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = _("Subscription")
        verbose_name_plural = _("Subscriptions")
        ordering            = ["next_billing_date"]

    def __str__(self):
        return f"{self.company} - {self.service_type} ({self.billing_cycle})"