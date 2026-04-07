from django.urls import path
from .views import (
    CommissionListCreateView, CommissionDetailView,
    EmployeeRequestListCreateView, EmployeeRequestDetailView,
    ReviewRequestView,
)

urlpatterns = [
    path("commissions/",               CommissionListCreateView.as_view(),   name="commission-list"),
    path("commissions/<int:pk>/",      CommissionDetailView.as_view(),        name="commission-detail"),
    path("requests/",                  EmployeeRequestListCreateView.as_view(), name="request-list"),
    path("requests/<int:pk>/",         EmployeeRequestDetailView.as_view(),   name="request-detail"),
    path("requests/<int:pk>/review/",  ReviewRequestView.as_view(),           name="request-review"),
]