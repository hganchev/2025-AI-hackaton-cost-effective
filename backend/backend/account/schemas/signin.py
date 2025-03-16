from ninja import Schema


class SigninRequest(Schema):
    """Schema for user signin requests."""
    email: str
    password: str


class SigninResponse(Schema):
    """Schema for successful signin responses."""
    success: bool = True
    message: str = "Login successful"
    account_id: int
    email: str
    token: str
    is_verified: bool


class TokenPayload(Schema):
    """Schema for JWT token payload."""
    sub: str
    exp: int
    iat: int
    is_verified: bool
