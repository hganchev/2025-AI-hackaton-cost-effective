from typing import Union, Dict, Any

from django.contrib.auth import get_user_model
from django.http import HttpRequest
from ninja import Router

from backend.account.constants import Status
from backend.account.models import BaseAccount, Profile
from backend.account.schemas.profile import ProfileUpdateSchema, ProfileUpdateResponseSchema, ProfileErrorSchema
from backend.utils.auth import JWTAuth

profile_update_router = Router()

AccountModel: BaseAccount = get_user_model()


@profile_update_router.put(
    "update",
    response={
        Status.HTTP_200_OK: ProfileUpdateResponseSchema,
        Status.HTTP_404_NOT_FOUND: ProfileErrorSchema,
    },
    auth=JWTAuth(),
    description="Update user profile information",
    summary="Update user profile",
    tags=["Profile"]
)
def update_profile(request: HttpRequest, data: ProfileUpdateSchema) -> Union[
    Dict[str, Any], tuple[int, Dict[str, Any]]]:
    """Update the profile for the authenticated user."""
    user_id = request.auth  # This would be the user_id extracted from the token

    try:
        account = AccountModel.objects.get(id=user_id)
        profile = Profile.objects.get(account=account)

        # Update only provided fields
        if data.first_name is not None:
            profile.fist_name = data.first_name  # Note the typo in model field
        if data.last_name is not None:
            profile.last_name = data.last_name

        profile.save()

        return {
            "first_name": profile.fist_name,
            "last_name": profile.last_name
        }
    except (AccountModel.DoesNotExist, Profile.DoesNotExist):
        return Status.HTTP_404_NOT_FOUND, {"error": "Profile not found"}
