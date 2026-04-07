from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from apps.accounts.dashboard import dashboard_stats
from django.views.generic import TemplateView
from apps.accounts.pwa_views import OfflineView, web_manifest

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

urlpatterns = [
    # i18n prefix للـ admin
    *i18n_patterns(
        path("admin/", admin.site.urls),
        prefix_default_language=False,
    ),
    # API — بدون prefix (Accept-Language header يتحكم باللغة)
    path("api/v1/", include([
        path("auth/",      include("apps.accounts.urls")),
        path("companies/", include("apps.companies.urls")),
        path("services/",  include("apps.services.urls")),
        path("reports/",   include("apps.reports.urls")),
        path("contracts/", include("apps.contracts.urls")),
        path("finance/",   include("apps.finance.urls")),
        path("employees/", include("apps.employees.urls")),
        # API Docs
        path("schema/",  SpectacularAPIView.as_view(), name="schema"),
        path("docs/",    SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
        path("dashboard/", dashboard_stats, name="dashboard"),
        path("offline/", OfflineView.as_view(), name="offline"),
        path("manifest.webmanifest", web_manifest, name="manifest"),
        path("sw.js", TemplateView.as_view(
            template_name="pwa/sw.js",
            content_type="application/javascript",
        ), name="service-worker"),
    ])),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)