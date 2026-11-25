from pathlib import Path

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from rest_framework import status
from drf_spectacular.utils import extend_schema

from .services.ai_translation.ai_translation_service import LlamacppTranslator
from .serializers import AITranslateRequestSerializer


class AITranslateView(APIView):
    permission_classes = [AllowAny]

    OP_AI_TRANSLATE = "ai_translate"
    OP_SUPPORTED_LANGUAGES = "supported_languages"
    operation = None

    translator_service = LlamacppTranslator()

    @extend_schema(
        operation_id=OP_AI_TRANSLATE,
        summary="Translate text using AI",
        description="Translates text into multiple target languages.",
        request=AITranslateRequestSerializer,
        responses={
            status.HTTP_200_OK : {
                "type": "array",
                "items": {"type": "string"}
            },
        }
    ) 
    def post(self, request):
        if self.operation != self.OP_AI_TRANSLATE:
            raise NotFound("Unknown endpoint")

        serializer = AITranslateRequestSerializer(
            data=request.data,
            context={"supported_languages": list(self.translator_service.get_supported_languages().keys())}
        )
        serializer.is_valid(raise_exception=True)

        result = self.translator_service.translate(
            **serializer.validated_data
        )
        return Response(result)

    @extend_schema(
        operation_id=OP_SUPPORTED_LANGUAGES,
        summary="Get supported languages",
        description="Returns available language codes and their names.",
        responses={
            status.HTTP_200_OK: {
                "type": "object",
                "additionalProperties": {"type": "string"}
            }
        }
    )
    def get(self, request):
        if self.operation != self.OP_SUPPORTED_LANGUAGES:
            raise NotFound("Unknown endpoint")

        return Response(
            self.translator_service.get_supported_languages()
        )



# class TranslateView(APIView):
#     permission_classes = [AllowAny]

#     translator_service = LlamacppTranslator()

#     subpath_ai_translate = Path("ai_translate")
#     subpath_ai_translate_supported_languages = subpath_ai_translate / "supported_languages"


#     def post(self, request, subpath=""):
#         if subpath == self.subpath_ai_translate.as_posix():
#             return Response(self.translator_service.translate(**request.data))

#         raise NotFound("Unknown endpoint")

#     def get(self, request, subpath=""):
#         if subpath == self.subpath_ai_translate_supported_languages.as_posix():
#             return Response(self.translator_service.get_supported_languages())

#         raise NotFound("Unknown endpoint")