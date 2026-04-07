from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.companies.models import Company


class Commission(models.Model):
    class Status(models.TextChoices):
        PENDING   = "pending",   _("Pending")
        PAID      = "paid",      _("Paid")
        CANCELLED = "cancelled", _("Cancelled")

    employee        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                                        related_name="commissions", verbose_name=_("Employee"))
    company         = models.ForeignKey(Company, on_delete=models.PROTECT,
                                        related_name="commissions", verbose_name=_("Company"))
    amount          = models.DecimalField(_("Amount"), max_digits=10, decimal_places=2)
    date            = models.DateField(_("Date"))
    status          = models.CharField(_("Status"), max_length=20,
                                       choices=Status.choices, default=Status.PENDING)
    payment_voucher = models.ForeignKey(
        "finance.PaymentVoucher", on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="commissions", verbose_name=_("Payment Voucher")
    )
    notes           = models.TextField(_("Notes"), blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = _("Commission")
        verbose_name_plural = _("Commissions")
        ordering            = ["-date"]

    def __str__(self):
        return f"{self.employee} | {self.company} | {self.amount} ({self.status})"


class EmployeeRequest(models.Model):
    class RequestType(models.TextChoices):
        LEAVE    = "leave",    _("Leave")
        ADVANCE  = "advance",  _("Salary Advance")
        OVERTIME = "overtime", _("Overtime")
        OTHER    = "other",    _("Other")

    class Status(models.TextChoices):
        PENDING  = "pending",  _("Pending")
        APPROVED = "approved", _("Approved")
        REJECTED = "rejected", _("Rejected")

    employee     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                                     related_name="requests", verbose_name=_("Employee"))
    request_type = models.CharField(_("Request Type"), max_length=20, choices=RequestType.choices)
    description  = models.TextField(_("Description"))
    status       = models.CharField(_("Status"), max_length=20,
                                    choices=Status.choices, default=Status.PENDING)
    reviewed_by  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                     null=True, blank=True,
                                     related_name="reviewed_requests", verbose_name=_("Reviewed By"))
    reviewed_at  = models.DateTimeField(_("Reviewed At"), null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = _("Employee Request")
        verbose_name_plural = _("Employee Requests")
        ordering            = ["-created_at"]

    def __str__(self):
        return f"{self.employee} | {self.request_type} | {self.status}"