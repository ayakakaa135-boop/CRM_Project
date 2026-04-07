from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class Attachment(models.Model):
    # GenericForeignKey — يشتغل مع أي موديل
    content_type   = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id      = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    file       = models.FileField(_("File"), upload_to="attachments/%Y/%m/")
    name       = models.CharField(_("Name"), max_length=255, blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                    null=True, related_name="attachments",
                                    verbose_name=_("Uploaded By"))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = _("Attachment")
        verbose_name_plural = _("Attachments")
        ordering            = ["-created_at"]
        indexes             = [
            models.Index(fields=["content_type", "object_id"]),
        ]

    def __str__(self):
        return self.name or self.file.name

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.file.name.split("/")[-1]
        super().save(*args, **kwargs)