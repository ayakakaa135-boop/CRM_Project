from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def link_commission_to_voucher(self, commission_id: int, voucher_id: int):
    """يربط العمولة بسند الصرف ويحدّث حالتها إلى paid."""
    try:
        from .models import Commission
        from apps.finance.models import PaymentVoucher

        commission      = Commission.objects.get(pk=commission_id)
        voucher         = PaymentVoucher.objects.get(pk=voucher_id)
        commission.payment_voucher = voucher
        commission.status          = Commission.Status.PAID
        commission.save()
        logger.info(f"Commission #{commission_id} linked to voucher #{voucher_id}")
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30)