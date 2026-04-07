from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from apps.accounts.permissions import IsAdminOrManager
from .models import Contract, Subscription
from .serializers import ContractSerializer, SubscriptionSerializer


class ContractListCreateView(generics.ListCreateAPIView):
    queryset           = Contract.objects.select_related("company")
    serializer_class   = ContractSerializer
    permission_classes = [IsAdminOrManager]
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields   = ["status", "company"]
    search_fields      = ["company__name", "notes"]
    ordering_fields    = ["start_date", "end_date", "value"]


class ContractDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Contract.objects.select_related("company")
    serializer_class   = ContractSerializer
    permission_classes = [IsAdminOrManager]


class SubscriptionListCreateView(generics.ListCreateAPIView):
    queryset           = Subscription.objects.select_related("company", "service_type", "contract")
    serializer_class   = SubscriptionSerializer
    permission_classes = [IsAdminOrManager]
    filter_backends    = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields   = ["status", "company", "billing_cycle"]
    ordering_fields    = ["next_billing_date", "price"]


class SubscriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Subscription.objects.select_related("company", "service_type")
    serializer_class   = SubscriptionSerializer
    permission_classes = [IsAdminOrManager]