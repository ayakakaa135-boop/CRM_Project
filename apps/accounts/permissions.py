from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin)


class IsAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated
            and request.user.role in ("admin", "manager")
        )


class IsOwnerOrAdmin(BasePermission):
    """الموظف يصل لبياناته فقط — الأدمن يصل للكل."""
    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True
        return obj == request.user