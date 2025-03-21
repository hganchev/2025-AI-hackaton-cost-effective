from ninja import Schema


class VerificationRequest(Schema):
    """Schema for account verification requests."""
    code: str


class VerificationResponse(Schema):
    """Schema for successful verification responses."""
    success: bool = True
    message: str = "Account successfully verified"


class ResendVerificationRequest(Schema):
    """Schema for resending verification code requests."""
    email: str


class ResendVerificationResponse(Schema):
    """Schema for successful resend verification responses."""
    success: bool = True
    message: str = "Verification code has been resent"
