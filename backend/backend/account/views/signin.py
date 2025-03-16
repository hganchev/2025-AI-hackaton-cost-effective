from typing import Union, Dict, Any

from django.contrib.auth import get_user_model, authenticate
from django.http import HttpRequest, HttpResponse
from ninja import Router

from backend.account.constants import Status, AuthErrors
from backend.account.models import BaseAccount
from backend.account.schemas.signin import SigninRequest, SigninResponse
from backend.account.schemas.common import ErrorResponse
from backend.account.utils import TokenUtilsMixin

sign_in_router = Router()

AccountModel: BaseAccount = get_user_model()


@sign_in_router.post(
    'signin',
    response={
        Status.HTTP_200_OK: SigninResponse,
        Status.HTTP_400_BAD_REQUEST: ErrorResponse,
        Status.HTTP_401_UNAUTHORIZED: ErrorResponse,
    },
    auth=None,
    description='Authenticate user and return JWT tokens',
    summary='User login',
    tags=['Authentication']
)
def sign_in(request: HttpRequest, data: SigninRequest) -> Union[
    Dict[str, Any], tuple[int, Dict[str, Any]], HttpResponse]:
    account = authenticate(email=data.email, password=data.password)

    if not account:
        return Status.HTTP_401_UNAUTHORIZED, {'message': AuthErrors.INVALID_CREDENTIALS.value}

    if not account.is_active:
        return Status.HTTP_401_UNAUTHORIZED, {'message': AuthErrors.ACCOUNT_NOT_ACTIVE.value}

    # Generate JWT tokens
    token_utils = TokenUtilsMixin()
    access_token, refresh_token = token_utils.create_tokens(account)

    # Prepare response data
    response_data = {
        "success": True,
        "message": "Login successful",
        "account_id": account.id,
        "email": account.email,
        "token": access_token,
        "is_verified": account.is_active
    }

    # Create HTTP response with the response schema
    response = SigninResponse(**response_data)

    # Set refresh token as cookie in the response
    http_response = HttpResponse(response.json())
    token_utils.set_auth_cookie(http_response, 'refresh_token', refresh_token)

    return http_response
