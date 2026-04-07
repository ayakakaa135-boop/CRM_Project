# دليل تشغيل وتأكيد مشروع Django CRM (بيئة الإنتاج)

تهانينا! لقد تم إعداد بيئة الإنتاج باستخدام Docker بنجاح. جميع الخدمات الآن تعمل بشكل متكامل.

## 1. التأكد من حالة الخدمات (Containers)
للتأكد من أن جميع الأجزاء تعمل بشكل صحيح، يمكنك تشغيل الأمر التالي في التيرمينال:
```powershell
docker-compose ps
```
يجب أن ترى جميع الخدمات بحالة `Up`.

## 2. روابط الدخول للبرنامج
بعد تشغيل الحاويات، يمكنك الوصول للخدمات عبر الروابط التالية:

- **واجهة الإدارة (Django Admin):**
  [http://localhost/admin/](http://localhost/admin/)
  *(ملاحظة: تحتاج لإنشاء Superuser باستخدام الأمر المذكور لاحقاً)*

- **وثائق الـ API (Swagger UI):**
  [http://localhost/api/docs/](http://localhost/api/docs/)

- **مخطط الـ API (Redoc):**
  [http://localhost/api/redoc/](http://localhost/api/redoc/)

## 3. التعامل مع المهام الخلفية (Celery)
المهام الخلفية تعمل الآن مع Redis. يمكنك متابعة السجلات للتأكد من تنفيذ المهام:
```powershell
docker-compose logs -f celery_worker
```

## 4. أوامر مفيدة
- **إنشاء مستخدم مدير (Superuser):**
  ```powershell
  docker-compose exec api uv run python manage.py createsuperuser
  ```
- **إعادة تشغيل النظام بالكامل:**
  ```powershell
  docker-compose -f docker-compose.yml up --build
  ```
- **عرض السجلات (Logs) لجميع الخدمات:**
  ```powershell
  docker-compose logs -f
  ```

---
تم إصلاح جميع مشاكل الربط، التبعيات (Dependencies)، وتعارضات البيئة الافتراضية. البرنامج الآن جاهز للعمل الحقيقي.
