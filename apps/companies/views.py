from django.utils.translation import gettext_lazy as _
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend

from apps.accounts.permissions import IsAdminOrManager
from .models import Company
from .serializers import CompanySerializer, CompanyListSerializer
from .filters import CompanyFilter


class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class  = CompanyFilter
    search_fields    = ["name", "cr_number", "email"]
    ordering_fields  = ["name", "created_at", "status"]
    permission_classes = [IsAdminOrManager]

    def get_serializer_class(self):
        return CompanyListSerializer if self.request.method == "GET" else CompanySerializer


class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Company.objects.all()
    serializer_class   = CompanySerializer
    permission_classes = [IsAdminOrManager]