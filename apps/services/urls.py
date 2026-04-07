from django.urls import path
from .views import ServiceTypeListCreateView, ServiceTypeDetailView

urlpatterns = [
    path("",          ServiceTypeListCreateView.as_view(), name="service-list"),
    path("<int:pk>/", ServiceTypeDetailView.as_view(),     name="service-detail"),
]