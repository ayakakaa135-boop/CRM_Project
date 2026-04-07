from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.companies.models import Company
from apps.contracts.models import Subscription


class ReceiptVoucher(models.Model):
    """سند قبض — أموال واردة من العميل."""

    class PaymentMethod(models.TextChoices):
        CASH         = "cash",         _("Cash")
        BANK_TRANSFER = "bank_transfer", _("Bank Transfer")
        CHEQUE       = "cheque",       _("Cheque")
        OTHER        = "other",        _("Other")

    company        = models.ForeignKey(Company, on_delete=models.PROTECT,
                                       related_name="receipt_vouchers", verbose_name=_("Company"))
    subscription   = models.ForeignKey(Subscription, on_delete=models.SET_NULL,
                                       null=True, blank=True,
                                       related_name="receipt_vouchers", verbose_name=_("Subscription"))
    amount         = models.DecimalField(_("Amount"), max_digits=12, decimal_places=2)
    date           = models.DateField(_("Date"))
    payment_method = models.CharField(_("Payment Method"), max_length=20,
                                      choices=PaymentMethod.choices, default=PaymentMethod.CASH)
    reference      = models.CharField(_("Reference"), max_length=100, blank=True)
    notes          = models.TextField(_("Notes"), blank=True)
    created_by     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                                       related_name="receipt_vouchers", verbose_name=_("Created By"))
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = _("Receipt Voucher")
        verbose_name_plural = _("Receipt Vouchers")
        ordering            = ["-date"]

    def __str__(self):
        return f"RV-{self.pk} | {self.company} | {self.amount}"


class PaymentVoucher(models.Model):
    """سند صرف — أموال صادرة (رواتب، عمولات، مصاريف)."""

    class VoucherType(models.TextChoices):
        SALARY     = "salary",     _("Salary")
        COMMISSION = "commission", _("Commission")
        EXPENSE    = "expense",    _("Expense")
        OTHER      = "other",      _("Other")

    class PaymentMethod(models.TextChoices):
        CASH          = "cash",          _("Cash")
        BANK_TRANSFER = "bank_transfer", _("Bank Transfer")
        CHEQUE        = "cheque",        _("Cheque")

    voucher_type   = models.CharField(_("Voucher Type"), max_length=20,
                                      choices=VoucherType.choices)
    employee       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                       null=True, blank=True,
                                       related_name="payment_vouchers", verbose_name=_("Employee"))
    amount         = models.DecimalField(_("Amount"), max_digits=12, decimal_places=2)
    date           = models.DateField(_("Date"))
    payment_method = models.CharField(_("Payment Method"), max_length=20,
                                      choices=PaymentMethod.choices, default=PaymentMethod.CASH)
    reference      = models.CharField(_("Reference"), max_length=100, blank=True)
    notes          = models.TextField(_("Notes"), blank=True)
    created_by     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                                       related_name="created_payment_vouchers",
                                       verbose_name=_("Created By"))
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = _("Payment Voucher")
        verbose_name_plural = _("Payment Vouchers")
        ordering            = ["-date"]

    def __str__(self):
        return f"PV-{self.pk} | {self.voucher_type} | {self.amount}"