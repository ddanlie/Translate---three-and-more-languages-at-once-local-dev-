# threetranslate/urls.py

from rest_framework.routers import DefaultRouter
from django.urls import path, include

from .views import TranslateView

router = DefaultRouter()
#router.register("translations", SomeViewSet)

urlpatterns = [
    path("translate/<path:subpath>", TranslateView.as_view(), name="translate"),
    #path('', include(router.urls))
]

