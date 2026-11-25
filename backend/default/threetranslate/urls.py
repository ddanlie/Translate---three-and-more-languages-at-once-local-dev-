# threetranslate/urls.py

from rest_framework.routers import DefaultRouter
from django.urls import path, include

from .views import AITranslateView


router = DefaultRouter()
#router.register("translations", SomeViewSet)

urlpatterns = [
    path(
        "translate/ai_translate",
        AITranslateView.as_view(
            operation=AITranslateView.OP_AI_TRANSLATE,
            http_method_names=["post", "options"]
        ), 
    ),
    path(
        "translate/ai_translate/supported_languages",
        AITranslateView.as_view(
            operation=AITranslateView.OP_SUPPORTED_LANGUAGES,
            http_method_names=["get", "options"]
        ),
    ),
]

