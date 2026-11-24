from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from pathlib import Path

from .services.ai_translation.ai_translation_service import LlamacppTranslator




class TranslateView(APIView):
    permission_classes = [AllowAny]

    translator_service = LlamacppTranslator()

    subpath_ai_translate = Path("ai_translate")
    subpath_ai_translate_supported_languages = subpath_ai_translate / "supported_languages"


    def post(self, request, subpath=""):
        if subpath == self.subpath_ai_translate.as_posix():
            return Response(self.translator_service.translate(**request.data))

        raise NotFound("Unknown endpoint")

    def get(self, request, subpath=""):
        if subpath == self.subpath_ai_translate_supported_languages.as_posix():
            return Response(self.translator_service.get_supported_languages())

        raise NotFound("Unknown endpoint")