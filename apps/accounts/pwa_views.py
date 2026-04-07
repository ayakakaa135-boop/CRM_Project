from django.http import JsonResponse
from django.views.generic import TemplateView
from django.utils.translation import gettext_lazy as _


class OfflineView(TemplateView):
    template_name = "pwa/offline.html"


def web_manifest(request):
    """يُعيد manifest.webmanifest ديناميكياً."""
    manifest = {
        "name":             str(_("Government Business Services CRM")),
        "short_name":       "CRM",
        "start_url":        "/",
        "display":          "standalone",
        "theme_color":      "#1a6b3a",
        "background_color": "#ffffff",
        "lang":             request.LANGUAGE_CODE,
        "dir":              "rtl" if request.LANGUAGE_CODE == "ar" else "ltr",
        "icons": [
            {"src": "/static/icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/static/icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
        ],
    }
    return JsonResponse(manifest, content_type="application/manifest+json")