from typing import Union, Dict, Any

from django.contrib.auth import get_user_model
from django.db import transaction
from django.http import HttpRequest
from ninja import Router

from backend.account.constants import Status, AuthErrors
from backend.account.models import BaseAccount
from backend.account.schemas.signup import SignupRequest, SignupResponse, SignupErrorSchema

sign_up_router = Router()

AccountModel: BaseAccount = get_user_model()


@sign_up_router.post(
    'signup',
    response={
        Status.HTTP_201_CREATED: SignupResponse,
        Status.HTTP_400_BAD_REQUEST: SignupErrorSchema
    },
    auth=None,
    description='Creates a new user account with profile information and verification code',
    summary='Register a new user account',
    tags=['Authentication']
)
def sign_up(request: HttpRequest, data: SignupRequest) -> Union[Dict[str, Any], tuple[int, Dict[str, Any]]]:
    if data.password != data.re_password:
        return Status.HTTP_400_BAD_REQUEST, {'error': AuthErrors.PASSWORDS_DO_NOT_MATCH}

    if AccountModel.objects.filter(email=data.email).exists():
        return Status.HTTP_400_BAD_REQUEST, {'error': AuthErrors.EMAIL_ALREADY_EXISTS}

    with transaction.atomic():
        AccountModel.objects.create_user(email=data.email, password=data.password)

    return Status.HTTP_201_CREATED, {"success": True, "message": "Account created successfully"}
