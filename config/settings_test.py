from .settings import *  # noqa

# قاعدة بيانات سريعة للاختبارات
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME":   BASE_DIR / "test_db.sqlite3",
    }
}

# تعطيل Celery في الاختبارات — نشغّل المهام synchronously
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# تسريع hash كلمة المرور
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]

# استخدام الترجمة في الاختبارات
USE_I18N = True

# media مؤقت
import tempfile
MEDIA_ROOT = tempfile.mkdtemp()

DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"