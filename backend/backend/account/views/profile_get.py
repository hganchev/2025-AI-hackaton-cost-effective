from typing import Union, Dict, Any

from django.contrib.auth import get_user_model
from django.http import HttpRequest
from ninja import Router

from backend.account.constants import Status
from backend.account.models import BaseAccount, Profile
from backend.account.schemas.profile import ProfileSchema, ProfileErrorSchema
from backend.utils.auth import JWTAuth

profile_get_router = Router()

AccountModel: BaseAccount = get_user_model()


@profile_get_router.get(
    "",
    response={
        Status.HTTP_200_OK: ProfileSchema,
        Status.HTTP_404_NOT_FOUND: ProfileErrorSchema,
    },
    auth=JWTAuth(),
    description="Get user profile information",
    summary="Get user profile",
    tags=["Profile"]
)
def get_profile(request: HttpRequest) -> Union[Dict[str, Any], tuple[int, Dict[str, Any]]]:
    """Get the profile for the authenticated user."""
    user_id = request.auth  # This would be the user_id extracted from the token

    try:
        account = AccountModel.objects.get(id=user_id)
        profile = Profile.objects.get(account=account)

        return {
            "id": profile.id,
            "email": account.email,
            "first_name": profile.fist_name,  # Note: There's a typo in your model
            "last_name": profile.last_name,
            "is_verified": account.is_active
        }
    except (AccountModel.DoesNotExist, Profile.DoesNotExist):
        return Status.HTTP_404_NOT_FOUND, {"error": "Profile not found"}
