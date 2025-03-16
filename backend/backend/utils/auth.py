import jwt
from ninja.security import HttpBearer
from django.conf import settings

from backend.account.constants import JTWSettings


class JWTAuth(HttpBearer):
    """
    Authentication class for validating JWT tokens in API endpoints.
    Returns the user ID from the token if valid.
    """
    def authenticate(self, request, token):
        try:
            # Decode and validate the JWT token
            payload = jwt.decode(
                token, 
                JTWSettings.JWT_SECRET.value, 
                algorithms=[JTWSettings.JWT_ALGORITHM.value]
            )
            
            # Extract user ID from the 'sub' claim
            user_id = payload.get("sub")
            if user_id:
                return user_id
                
            return None
        except (jwt.PyJWTError, Exception):
            return None 