

from abc import ABC, abstractmethod
import asyncio
import requests


class Translator(ABC):
    """Abstract base class for translation backends."""

    @abstractmethod
    def translate(self, text: str, source_language: str, target_languages: list[str]) -> list[str]:
        """Translate ``text`` from ``source_language`` into ``target_languages``."""
        raise NotImplementedError

    async def atranslate(self, text: str, source_language: str, target_languages: list[str]) -> list[str]:
        """Async adapter for callers running on an event loop (e.g. ASGI views).

        Backends only implement the sync ``translate``; this offloads it to a worker
        thread so a blocking HTTP call never stalls the event loop.
        """
        return await asyncio.to_thread(self.translate, text, source_language, target_languages)

class LlamacppTranslator(Translator):
    """Translator implementation using Llama.cpp backend."""
    SERVER = "http://127.0.0.1:8080/v1/chat/completions"
    DEFAULT_MODEL = "translategemma-4b-it.Q8_0.gguf"#"translategemma-12b-it.i1-Q4_K_M.gguf"
    def __init__(self, model_name=None, max_tokens=4096, enable_thinking=False):
        self.model_name = model_name or LlamacppTranslator.DEFAULT_MODEL
        self.max_tokens = max_tokens
        # TranslateGemma's chat template has no reasoning/thinking section, so this is a
        # no-op for it; it is forwarded for thinking-capable models served by llama.cpp.
        self.enable_thinking = enable_thinking
    def translate(self, text: str, source_language: str, target_languages: list[str]) -> list[str]:
        payload = {
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": text
                        }
                    ]
                }
            ],
            "temperature": 0,
            "max_tokens": self.max_tokens,
            # llama.cpp's OpenAI layer drops unknown content-part keys, so the language codes
            # are passed as template kwargs; chat_template.jinja reads them from there.
            "chat_template_kwargs": {
                "enable_thinking": self.enable_thinking,
                "source_lang_code": source_language,
                "target_lang_code": "",
            },
            "stream": False
        }

        results = []
        for target_language in target_languages:
            payload["chat_template_kwargs"]["target_lang_code"] = target_language
            response = requests.post(
                LlamacppTranslator.SERVER,
                json=payload,
                timeout=120
            )

            response.raise_for_status()

            result = response.json()["choices"][0]["message"]["content"].strip()
            results.append(result)

        return results

class MicrosoftCloudTranslator(Translator):
    """Translator implementation using Microsoft cloud API backend."""

    def translate(self, text: str, source_language: str, target_languages: list[str]) -> list[str]:
        # Implement the translation logic using Microsoft cloud API here
        raise NotImplementedError("MicrosoftCloudTranslator is not implemented yet.")

class GoogleCloudTranslator(Translator):
    """Translator implementation using Google cloud API backend."""

    def translate(self, text: str, source_language: str, target_languages: list[str]) -> list[str]:
        # Implement the translation logic using Google cloud API here
        raise NotImplementedError("GoogleCloudTranslator is not implemented yet.")

class AmazonCloudTranslator(Translator):
    """Translator implementation using Amazon cloud API backend."""

    def translate(self, text: str, source_language: str, target_languages: list[str]) -> list[str]:
        # Implement the translation logic using Amazon cloud API here
        raise NotImplementedError("AmazonCloudTranslator is not implemented yet.")