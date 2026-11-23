from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .services.ai_translation.ai_translation_service import LlamacppTranslator


@api_view(["POST"])
@permission_classes([AllowAny])
def translate(request):
    """POST {"text": ..., "source_language": ..., "target_languages": [...]} -> ["...", ...]"""
    return Response(LlamacppTranslator().translate(**request.data))


