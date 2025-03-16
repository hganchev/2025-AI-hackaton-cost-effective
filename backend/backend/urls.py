# from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from backend.account.views.signin import sign_in_router
from backend.account.views.signup import sign_up_router
from backend.account.views.verification import verification_router

api = NinjaAPI(docs_url='docs/')
[
    api.add_router('auth/', router=router)
    for router in (sign_up_router, verification_router, sign_in_router)
]

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/', api.urls),
]
