from django.db import models
from django.utils.translation import gettext_lazy as _


class ServiceType(models.Model):
    name        = models.CharField(_("Name"), max_length=255)       # translatable
    description = models.TextField(_("Description"), blank=True)    # translatable
    is_active   = models.BooleanField(_("Is Active"), default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = _("Service Type")
        verbose_name_plural = _("Service Types")
        ordering            = ["name"]

    def __str__(self):
        return self.name