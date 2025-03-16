from datetime import timedelta
from enum import Enum

from backend import settings


class Status:
    """HTTP status codes."""
    HTTP_200_OK = 200
    HTTP_201_CREATED = 201
    HTTP_400_BAD_REQUEST = 400
    HTTP_401_UNAUTHORIZED = 401
    HTTP_404_NOT_FOUND = 404
    HTTP_500_INTERNAL_SERVER_ERROR = 500


class AuthErrors(str, Enum):
    """Authentication error messages."""
    INVALID_CREDENTIALS = "invalid_credentials"
    ACCOUNT_NOT_ACTIVE = "account_not_active"
    ACCOUNT_NOT_FOUND = "account_not_found"
    EMAIL_ALREADY_EXISTS = "email_already_exists"
    VERIFICATION_CODE_INVALID = "verification_code_invalid"
    VERIFICATION_CODE_EXPIRED = "verification_code_expired"
    ACCOUNT_ALREADY_VERIFIED = "account_already_verified"
    PASSWORDS_DO_NOT_MATCH = "Password miss match"


class JTWSettings(str, Enum):
    JWT_SECRET = getattr(settings, 'JWT_SECRET', 'default_secret_key_change_in_production')
    JWT_ALGORITHM = getattr(settings, 'JWT_ALGORITHM', 'HS256')
    ACCESS_TOKEN_LIFETIME = getattr(settings, 'ACCESS_TOKEN_LIFETIME', timedelta(minutes=15))
    REFRESH_TOKEN_LIFETIME = getattr(settings, 'REFRESH_TOKEN_LIFETIME', timedelta(days=7))
