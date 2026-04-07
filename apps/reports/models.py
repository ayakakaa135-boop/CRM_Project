import uuid
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.companies.models import Company
from apps.services.models import ServiceType


class ServiceReport(models.Model):
    class Status(models.TextChoices):
        DRAFT     = "draft",     _("Draft")
        PUBLISHED = "published", _("Published")
        ARCHIVED  = "archived",  _("Archived")

    company     = models.ForeignKey(Company, on_delete=models.PROTECT,
                                    related_name="reports", verbose_name=_("Company"))
    created_by  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                                    related_name="reports", verbose_name=_("Created By"))
    date        = models.DateField(_("Date"))
    status      = models.CharField(_("Status"), max_length=20,
                                   choices=Status.choices, default=Status.DRAFT)
    # الرابط الآمن بدون login
    share_token = models.UUIDField(_("Share Token"), default=uuid.uuid4,
                                   editable=False, unique=True)
    is_shared   = models.BooleanField(_("Is Shared"), default=False)
    notes       = models.TextField(_("Notes"), blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = _("Service Report")
        verbose_name_plural = _("Service Reports")
        ordering            = ["-date"]

    def __str__(self):
        return f"{self.company} - {self.date}"

    def get_share_url(self):
        from django.urls import reverse
        return reverse("report-share", kwargs={"token": self.share_token})


class ReportItem(models.Model):
    report       = models.ForeignKey(ServiceReport, on_delete=models.CASCADE,
                                     related_name="items", verbose_name=_("Report"))
    service_type = models.ForeignKey(ServiceType, on_delete=models.PROTECT,
                                     verbose_name=_("Service Type"))
    description  = models.TextField(_("Description"))
    notes        = models.TextField(_("Notes"), blank=True)

    class Meta:
        verbose_name        = _("Report Item")
        verbose_name_plural = _("Report Items")

    def __str__(self):
        return f"{self.report} - {self.service_type}"