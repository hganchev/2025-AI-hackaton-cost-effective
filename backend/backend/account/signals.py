from typing import Any

from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from backend.account.models import BaseAccount
from backend.account.service import refresh_verification
from backend.account.tasks import send_verification_code

AccountModel = get_user_model()


@receiver(post_save, sender=BaseAccount)
def create_account_verification(sender, instance: BaseAccount, created: bool, **kwargs: Any) -> None:
    """Create an AccountVerification object when a new Account is created."""
    if created and not instance.is_superuser:
        verification = refresh_verification(instance)
        send_verification_code.send(instance.email, verification.verification_code)
