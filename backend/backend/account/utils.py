import time
from datetime import timedelta
from typing import Tuple

import jwt
from django.http import HttpResponse

from backend import settings
from backend.account.constants import JTWSettings
from backend.account.models import BaseAccount

JWT_SECRET = getattr(settings, 'JWT_SECRET', 'default_secret_key_change_in_production')


class TokenUtilsMixin:
    """Utility methods for JWT token generation and handling."""

    def create_tokens(self, account: BaseAccount) -> Tuple[str, str]:
        """
        Create access and refresh tokens for the account.

        Args:
            account: The account to create tokens for

        Returns:
            A tuple containing the access token and refresh token
        """
        access_token = self._create_token(
            account=account,
            token_type="access",
            lifetime=JTWSettings.ACCESS_TOKEN_LIFETIME.value
        )

        refresh_token = self._create_token(
            account=account,
            token_type="refresh",
            lifetime=JTWSettings.REFRESH_TOKEN_LIFETIME.value
        )

        return access_token, refresh_token

    def _create_token(self, account: BaseAccount, token_type: str, lifetime: timedelta) -> str:
        """
        Create a JWT token with the specified type and lifetime.

        Args:
            account: The account to create a token for
            token_type: The type of token ("access" or "refresh")
            lifetime: The token lifetime

        Returns:
            A JWT token string
        """
        now = int(time.time())
        expiration = now + int(lifetime.total_seconds())

        payload = {
            'sub': str(account.id),
            'exp': expiration,
            'iat': now,
            'type': token_type,
            'is_verified': account.is_active
        }

        return jwt.encode(payload, JTWSettings.JWT_SECRET.value, algorithm=JTWSettings.JWT_ALGORITHM.value)

    @staticmethod
    def set_auth_cookie(response: HttpResponse, token_name: str, token: str) -> None:
        """
        Set an authentication cookie on the response.

        Args:
            response: The HTTP response
            token_name: The name of the cookie
            token: The token to set in the cookie
        """
        # Get cookie settings from settings or use defaults
        cookie_secure = getattr(settings, 'JWT_COOKIE_SECURE', True)
        cookie_httponly = getattr(settings, 'JWT_COOKIE_HTTPONLY', True)
        cookie_samesite = getattr(settings, 'JWT_COOKIE_SAMESITE', 'Lax')
        cookie_max_age = int(JTWSettings.REFRESH_TOKEN_LIFETIME.value.total_seconds())

        response.set_cookie(
            key=token_name,
            value=token,
            max_age=cookie_max_age,
            secure=cookie_secure,
            httponly=cookie_httponly,
            samesite=cookie_samesite
        )
