from celery import shared_task
from django.utils.translation import gettext_lazy as _
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def generate_report_pdf(self, report_id: int):
    """يولّد PDF للتقرير بعد إنشائه."""
    try:
        from .models import ServiceReport
        from .pdf import build_report_pdf

        report = ServiceReport.objects.prefetch_related("items__service_type").get(pk=report_id)
        build_report_pdf(report)
        logger.info(f"PDF generated for report #{report_id}")
    except Exception as exc:
        logger.error(f"PDF generation failed for report #{report_id}: {exc}")
        raise self.retry(exc=exc, countdown=60)