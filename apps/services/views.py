from rest_framework import generics, filters
from apps.accounts.permissions import IsAdminOrManager
from .models import ServiceType
from .serializers import ServiceTypeSerializer


class ServiceTypeListCreateView(generics.ListCreateAPIView):
    queryset           = ServiceType.objects.all()
    serializer_class   = ServiceTypeSerializer
    permission_classes = [IsAdminOrManager]
    filter_backends    = [filters.SearchFilter]
    search_fields      = ["name"]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.query_params.get("active_only"):
            qs = qs.filter(is_active=True)
        return qs


class ServiceTypeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = ServiceType.objects.all()
    serializer_class   = ServiceTypeSerializer
    permission_classes = [IsAdminOrManager]