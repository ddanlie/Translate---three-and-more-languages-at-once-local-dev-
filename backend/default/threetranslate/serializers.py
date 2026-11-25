from typing import Any, cast

from rest_framework import routers, serializers, viewsets
from rest_framework import serializers
from django.conf import settings

# Example rest serializer
# class UserSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = User
#         fields = ["url", "username", "email", "is_staff"]




class AITranslateRequestSerializer(serializers.Serializer):
    text = serializers.CharField(
        min_length=1,
        max_length=settings.MAX_AI_TRANSLATION_TEXT_LENGTH,
        trim_whitespace=True,
    )
    source_language = serializers.ChoiceField(choices=[])
    target_languages = serializers.ListField(
        child=serializers.ChoiceField(choices=[]),
        allow_empty=False,
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # `Serializer.fields` is a `cached_property`, so type checkers cannot
        # index it directly; cast it to a plain mapping first.

        supported: list[str] = self.context.get("supported_languages", ["en"])
        
        fields = cast(dict[str, Any], self.fields)
        fields["source_language"].choices = supported
        fields["target_languages"].child.choices = supported