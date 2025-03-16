from ninja import Schema

from backend.account.constants import AuthErrors


class SignupRequest(Schema):
    """Schema for user signup requests."""
    email: str
    password: str
    re_password: str


class SignupResponse(Schema):
    """Schema for successful signup responses."""
    success: bool = True
    message: str = "Account created successfully"


class SignupErrorSchema(Schema):
    """Schema for signup error response."""
    error: AuthErrors
