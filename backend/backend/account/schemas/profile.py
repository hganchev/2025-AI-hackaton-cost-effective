from typing import Optional

from ninja import Schema


class ProfileSchema(Schema):
    """Schema for profile response."""
    id: int
    email: str
    first_name: str
    last_name: str
    is_verified: bool


class ProfileErrorSchema(Schema):
    """Schema for profile error response."""
    error: str


class ProfileUpdateSchema(Schema):
    """Schema for profile update request."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class ProfileUpdateResponseSchema(Schema):
    """Schema for profile update success response."""
    first_name: str
    last_name: str
