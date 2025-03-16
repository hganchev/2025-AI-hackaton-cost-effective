# from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from backend.account.views.profile_create import profile_create_router
from backend.account.views.profile_delete import profile_delete_router
from backend.account.views.profile_get import profile_get_router
from backend.account.views.profile_update import profile_update_router
from backend.account.views.signin import sign_in_router
from backend.account.views.signup import sign_up_router
from backend.account.views.verification import verification_router

api = NinjaAPI(docs_url='docs/')
[api.add_router('auth/', router=router) for router in (sign_up_router, verification_router, sign_in_router)]
[api.add_router('auth/profile', router=router) for router in
 (profile_get_router, profile_create_router, profile_update_router, profile_delete_router)]

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/', api.urls),
]
