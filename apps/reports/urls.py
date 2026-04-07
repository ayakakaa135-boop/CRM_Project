from django.urls import path
from .views import (
    ReportListCreateView, ReportDetailView,
    ReportShareToggleView, public_report_view,
)

urlpatterns = [
    path("",                        ReportListCreateView.as_view(),  name="report-list"),
    path("<int:pk>/",               ReportDetailView.as_view(),       name="report-detail"),
    path("<int:pk>/share/",         ReportShareToggleView.as_view(),  name="report-share-toggle"),
    path("share/<uuid:token>/",     public_report_view,               name="report-share"),
]