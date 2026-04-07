from celery import shared_task
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


@shared_task
def check_subscription_renewals():
    """يومي — يتحقق من الاشتراكات المستحقة للتجديد."""
    from .models import Subscription
    today  = timezone.now().date()
    due    = Subscription.objects.filter(status="active", next_billing_date__lte=today)
    count  = due.count()
    logger.info(f"Subscriptions due for renewal: {count}")
    # TODO: إنشاء إشعارات أو إيصالات تلقائية
    return count


@shared_task
def notify_expiring_contracts():
    """يومي — يُرسل إشعار للعقود التي تنتهي خلال 7 أيام."""
    from .models import Contract
    threshold = timezone.now().date() + timedelta(days=7)
    expiring  = Contract.objects.filter(status="active", end_date__lte=threshold)
    for contract in expiring:
        logger.warning(f"Contract #{contract.id} expiring on {contract.end_date}")
    return expiring.count()