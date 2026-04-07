from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN    = "admin",    _("Admin")
        MANAGER  = "manager",  _("Manager")
        EMPLOYEE = "employee", _("Employee")

    role   = models.CharField(_("Role"), max_length=20, choices=Role.choices, default=Role.EMPLOYEE)
    phone  = models.CharField(_("Phone"), max_length=20, blank=True)
    avatar = models.ImageField(_("Avatar"), upload_to="avatars/", blank=True, null=True)

    class Meta:
        verbose_name        = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role})"

    @property
    def is_admin(self):    return self.role == self.Role.ADMIN
    @property
    def is_manager(self):  return self.role == self.Role.MANAGER
    @property
    def is_employee(self): return self.role == self.Role.EMPLOYEE