# threetranslate/urls.py

from rest_framework.routers import DefaultRouter
from django.urls import path, include

from .views import translate

router = DefaultRouter()
#router.register("translations", SomeViewSet)

urlpatterns = [
    path("translate/", translate, name="translate"),
    path('', include(router.urls))
]

