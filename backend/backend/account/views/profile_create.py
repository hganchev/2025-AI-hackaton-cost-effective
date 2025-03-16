from typing import Union, Dict, Any

from django.contrib.auth import get_user_model
from django.http import HttpRequest
from ninja import Router

from backend.account.constants import Status
from backend.account.models import BaseAccount, Profile
from backend.account.schemas.profile import ProfileUpdateSchema, ProfileUpdateResponseSchema, ProfileErrorSchema
from backend.utils.auth import JWTAuth

profile_create_router = Router()

AccountModel: BaseAccount = get_user_model()


@profile_create_router.post(
    "create",
    response={
        Status.HTTP_201_CREATED: ProfileUpdateResponseSchema,
        Status.HTTP_400_BAD_REQUEST: ProfileErrorSchema,
    },
    auth=JWTAuth(),
    description="Create user profile",
    summary="Create user profile",
    tags=["Profile"]
)
def create_profile(request: HttpRequest, data: ProfileUpdateSchema) -> Union[
    Dict[str, Any], tuple[int, Dict[str, Any]]]:
    """Create a profile for the authenticated user."""
    user_id = request.auth  # This would be the user_id extracted from the token

    try:
        account = AccountModel.objects.get(id=user_id)

        # Check if profile already exists
        if Profile.objects.filter(account=account).exists():
            return Status.HTTP_400_BAD_REQUEST, {"error": "Profile already exists"}

        # Create new profile
        profile = Profile.objects.create(
            account=account,
            fist_name=data.first_name or "",  # Note the typo in model field
            last_name=data.last_name or ""
        )

        return Status.HTTP_201_CREATED, {
            "first_name": profile.fist_name,
            "last_name": profile.last_name
        }
    except AccountModel.DoesNotExist:
        return Status.HTTP_404_NOT_FOUND, {"error": "Account is not registered"}
