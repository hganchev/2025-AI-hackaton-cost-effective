from ninja import Schema


class ErrorResponse(Schema):
    """Standard error response schema."""
    success: bool = False
    message: str


class SuccessResponse(Schema):
    """Standard success response schema."""
    success: bool = True
    message: str
