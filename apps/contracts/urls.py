from django.urls import path
from .views import (
    ContractListCreateView, ContractDetailView,
    SubscriptionListCreateView, SubscriptionDetailView,
)

urlpatterns = [
    path("",                           ContractListCreateView.as_view(),     name="contract-list"),
    path("<int:pk>/",                  ContractDetailView.as_view(),          name="contract-detail"),
    path("subscriptions/",             SubscriptionListCreateView.as_view(),  name="subscription-list"),
    path("subscriptions/<int:pk>/",    SubscriptionDetailView.as_view(),      name="subscription-detail"),
]