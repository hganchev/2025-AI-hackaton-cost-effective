# from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from backend.account.views.signup import sign_up_router

api = NinjaAPI(docs_url='docs/')
[
    api.add_router('auth/', router=router)
    for router in (sign_up_router,)
]

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/', api.urls),
]
