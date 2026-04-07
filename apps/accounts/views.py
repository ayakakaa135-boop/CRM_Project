from django.utils.translation import gettext_lazy as _
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UserCreateSerializer,
    ChangePasswordSerializer,
    AdminSetPasswordSerializer,
)
from .permissions import IsAdmin, IsAdminOrManager, IsOwnerOrAdmin


class LoginView(TokenObtainPairView):
    """POST /api/v1/auth/login/"""
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    """POST /api/v1/auth/logout/ — يُبطل الـ refresh token."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data["refresh"])
            token.blacklist()
            return Response({"detail": _("Logged out successfully.")})
        except Exception:
            return Response(
                {"detail": _("Invalid token.")},
                status=status.HTTP_400_BAD_REQUEST,
            )


class MeView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/v1/auth/me/ — بيانات المستخدم الحالي."""
    serializer_class   = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    """POST /api/v1/auth/change-password/"""
    serializer_class   = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": _("Password updated successfully.")})


# ─── User Management (Admin only) ────────────────────────────

class UserListCreateView(generics.ListCreateAPIView):
    """GET /api/v1/auth/users/ — POST /api/v1/auth/users/"""
    queryset           = User.objects.all().order_by("-date_joined")
    permission_classes = [IsAdmin]

    def get_serializer_class(self):
        return UserCreateSerializer if self.request.method == "POST" else UserSerializer


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/v1/auth/users/<id>/"""
    queryset           = User.objects.all()
    serializer_class   = UserSerializer
    permission_classes = [IsAdmin]


class AdminSetUserPasswordView(generics.UpdateAPIView):
    """POST /api/v1/auth/users/<id>/set-password/"""
    queryset = User.objects.all()
    serializer_class = AdminSetPasswordSerializer
    permission_classes = [IsAdmin]

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"detail": _("Password updated successfully.")})
