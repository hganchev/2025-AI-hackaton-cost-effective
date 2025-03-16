from typing import Union, Dict, Any

from django.contrib.auth import get_user_model
from django.http import HttpRequest
from ninja import Router

from backend.account.constants import Status
from backend.account.models import BaseAccount, AccountVerification
from backend.account.schemas.verification import (
    VerificationRequest, VerificationResponse,
    ResendVerificationRequest, ResendVerificationResponse
)
from backend.account.schemas.common import ErrorResponse
from backend.account.service import refresh_verification
from backend.account.tasks import send_verification_code

verification_router = Router()
AccountModel: BaseAccount = get_user_model()


@verification_router.post(
    'verify',
    response={
        Status.HTTP_200_OK: VerificationResponse,
        Status.HTTP_400_BAD_REQUEST: ErrorResponse,
    },
    auth=None,
    description='Verify a user account with the provided verification code',
    summary='Verify user account',
    tags=['Authentication']
)
def verify_user_account(request: HttpRequest, data: VerificationRequest):
    try:
        account = AccountVerification.objects.get(verification_code=data.code).account
        account.is_active = True
        account.save()

        return Status.HTTP_200_OK, {'message': 'Account is already verified'}

    except AccountVerification.DoesNotExist:
        return Status.HTTP_400_BAD_REQUEST, {'message': 'Account not found'}


@verification_router.post(
    'resend',
    response={
        Status.HTTP_200_OK: ResendVerificationResponse,
        Status.HTTP_400_BAD_REQUEST: ErrorResponse,
    },
    auth=None,
    description='Resend verification code to the user email',
    summary='Resend verification code',
    tags=['Authentication']
)
def resend_verification(request: HttpRequest, data: ResendVerificationRequest):
    try:
        account = AccountModel.objects.get(email=data.email)
        if account.is_active:
            return Status.HTTP_400_BAD_REQUEST, {'message': 'Account is already verified'}

        verification = refresh_verification(account)
        send_verification_code.send(account.email, verification.verification_code)

        return Status.HTTP_200_OK, {"success": True, "message": "Verification code has been resent"}
    except AccountModel.DoesNotExist:
        return Status.HTTP_404_NOT_FOUND, {'message': 'Account with this email was not found'}
