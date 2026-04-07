from pathlib import Path
from decouple import config
from django.utils.translation import gettext_lazy as _
from celery.schedules import crontab


BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = config("SECRET_KEY")
DEBUG = config("DEBUG", default=False, cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="localhost,127.0.0.1").split(",")
_cors_allowed_origins = config("CORS_ALLOWED_ORIGINS", default="")
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in _cors_allowed_origins.split(",") if origin.strip()]
_csrf_trusted_origins = config("CSRF_TRUSTED_ORIGINS", default="")
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in _csrf_trusted_origins.split(",") if origin.strip()] or CORS_ALLOWED_ORIGINS
CORS_ALLOW_ALL_ORIGINS = DEBUG and not CORS_ALLOWED_ORIGINS
CORS_ALLOW_CREDENTIALS = True
DEMO_ADMIN_USERNAME = config("DEMO_ADMIN_USERNAME", default="admin")
DEMO_ADMIN_PASSWORD = config("DEMO_ADMIN_PASSWORD", default="Admin123!pass")
DEMO_ADMIN_EMAIL = config("DEMO_ADMIN_EMAIL", default="admin@example.com")

# ─── Apps ────────────────────────────────────────────────────
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "drf_spectacular",
    "django_celery_beat",
    "django_celery_results",
    "django_filters",
    "rest_framework_simplejwt.token_blacklist",
]

LOCAL_APPS = [
    "apps.accounts",
    "apps.companies",
    "apps.services",
    "apps.reports",
    "apps.contracts",
    "apps.finance",
    "apps.employees",
    "apps.attachments",
]

# modeltranslation يجب أن يكون أول INSTALLED_APPS
INSTALLED_APPS = ["modeltranslation"] + DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# ─── Middleware ───────────────────────────────────────────────
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",   # كشف اللغة تلقائياً
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "django.template.context_processors.i18n",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ─── Database ─────────────────────────────────────────────────
import dj_database_url

DATABASES = {
    "default": dj_database_url.config(
        default=config("DATABASE_URL"),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# ─── Auth ─────────────────────────────────────────────────────
AUTH_USER_MODEL = "accounts.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ─── i18n / l10n ──────────────────────────────────────────────
LANGUAGE_CODE = "ar"   # الافتراضي: العربية

LANGUAGES = [
    ("ar", _("Arabic")),
    ("en", _("English")),
]

TIME_ZONE = "Asia/Riyadh"
USE_I18N = True
USE_L10N = True
USE_TZ = True

LOCALE_PATHS = [BASE_DIR / "locale"]

# ─── Static & Media ───────────────────────────────────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ─── REST Framework ───────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    # قبول Accept-Language header
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend"],
}

# ─── JWT ──────────────────────────────────────────────────────
from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ─── drf-spectacular ──────────────────────────────────────────
SPECTACULAR_SETTINGS = {
    "TITLE": _("CRM API"),
    "DESCRIPTION": _("Government Business Services CRM"),
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

# ─── Celery ───────────────────────────────────────────────────
CELERY_BROKER_URL = config("REDIS_URL", default="redis://localhost:6379/0")
CELERY_RESULT_BACKEND = "django-db"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"

CELERY_BEAT_SCHEDULE = {
    "check-subscription-renewals": {
        "task":     "apps.contracts.tasks.check_subscription_renewals",
        "schedule": crontab(hour=8, minute=0),   # كل يوم 8 صباحاً
    },
    "notify-expiring-contracts": {
        "task":     "apps.contracts.tasks.notify_expiring_contracts",
        "schedule": crontab(hour=8, minute=30),
    },
}
