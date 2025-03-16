import random
import string
from datetime import timedelta
from typing import Optional

from django.utils import timezone

from backend.account.models import BaseAccount, AccountVerification


def generate_verification_code(length: int = 6) -> str:
    """Generate a random numeric verification code of specified length."""
    return ''.join(random.choices(string.digits, k=length))


def refresh_verification(account: BaseAccount) -> AccountVerification:
    """Refresh or create a verification code for an account."""
    code = generate_verification_code()
    expiration_time = timezone.now() + timedelta(hours=2)

    verification, created = AccountVerification.objects.update_or_create(
        account=account,
        defaults={'verification_code': code, 'expiration_time': expiration_time}
    )

    return verification


def verify_account(email: str, code: str) -> tuple[bool, Optional[str]]:
    """Verify an account using the provided email and verification code."""
    try:
        account = BaseAccount.objects.get(email=email)
    except BaseAccount.DoesNotExist:
        return False, "Account not found"

    try:
        verification = account.verification
    except AccountVerification.DoesNotExist:
        return False, "Verification record not found"

    if verification.verify(code):
        return True, None

    if verification.is_expired():
        return False, "Verification code has expired"
    return False, "Invalid verification code"
