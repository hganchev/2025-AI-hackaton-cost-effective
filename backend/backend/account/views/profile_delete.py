from typing import Union, Dict, Any

from django.contrib.auth import get_user_model
from django.http import HttpRequest
from ninja import Router

from backend.account.constants import Status
from backend.account.models import BaseAccount, Profile
from backend.account.schemas.common import SuccessResponse
from backend.account.schemas.profile import ProfileErrorSchema
from backend.utils.auth import JWTAuth

profile_delete_router = Router()

AccountModel: BaseAccount = get_user_model()


@profile_delete_router.delete(
    "delete",
    response={
        Status.HTTP_200_OK: SuccessResponse,
        Status.HTTP_404_NOT_FOUND: ProfileErrorSchema,
    },
    auth=JWTAuth(),
    description="Delete user profile",
    summary="Delete user profile",
    tags=["Profile"]
)
def delete_profile(request: HttpRequest) -> Union[Dict[str, Any], tuple[int, Dict[str, Any]]]:
    """Delete the profile for the authenticated user."""
    user_id = request.auth  # This would be the user_id extracted from the token

    try:
        account = AccountModel.objects.get(id=user_id)
        profile = Profile.objects.get(account=account)

        # Delete the profile
        profile.delete()

        return {"success": True, "message": "Profile deleted successfully"}
    except (AccountModel.DoesNotExist, Profile.DoesNotExist):
        return Status.HTTP_404_NOT_FOUND, {"error": "Profile not found"}
