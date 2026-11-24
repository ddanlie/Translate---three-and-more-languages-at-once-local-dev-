

from abc import ABC, abstractmethod
import asyncio
from concurrent.futures import ThreadPoolExecutor
from functools import partial
from pathlib import Path

from babel import Locale
from jinja2 import Environment, nodes
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
    DEFAULT_MODEL = "Hy-MT3-1.8B-Q8_0.gguf"#"Hy-MT3-7B-Q4_K_M.gguf"#"translategemma-4b-it.Q8_0.gguf"#"translategemma-12b-it.i1-Q4_K_M.gguf"
    # One request per target language runs concurrently; extra languages queue up.
    MAX_WORKERS = 5
    _executor = ThreadPoolExecutor(max_workers=MAX_WORKERS, thread_name_prefix="llamacpp-translate")

    CHAT_TEMPLATE = Path(__file__).with_name("chat_template.jinja")

    @staticmethod
    def _parse_supported_languages(template_path: Path = CHAT_TEMPLATE) -> dict[str, str]:
        """Read the ``languages`` mapping out of the chat template.

        The template is parsed as Jinja (not regex-matched), so any language added to
        its ``{% set languages = {...} %}`` block is picked up automatically. Codes with
        subtags get them spelled out in brackets, e.g. ``da-GL`` -> ``Danish (Greenland)``;
        bare codes stay plain, e.g. ``cs`` -> ``Czech``.
        """
        source = Path(template_path).read_text(encoding="utf-8")
        tree = Environment().parse(source)

        languages = {}
        for assignment in tree.find_all(nodes.Assign):
            if not isinstance(assignment.target, nodes.Name) or assignment.target.name != "languages":
                continue
            if not isinstance(assignment.node, nodes.Dict):
                continue
            for pair in assignment.node.items:
                if isinstance(pair.key, nodes.Const) and isinstance(pair.value, nodes.Const):
                    languages[pair.key.value] = pair.value.value

        english = Locale("en")
        supported = {}
        for code, name in languages.items():
            subtags = code.split("-")[1:]
            if not subtags:
                supported[code] = name
                continue
            labels = []
            for subtag in subtags:
                if len(subtag) == 4 and subtag[0].isupper():
                    label = english.scripts.get(subtag)
                elif len(subtag) == 2 and subtag.isupper():
                    label = english.territories.get(subtag)
                else:
                    label = english.variants.get(subtag)
                # Variants (e.g. "tarask") have no CLDR name; title-case them for display.
                labels.append(label or (subtag.title() if len(subtag) > 3 else subtag))
            supported[code] = f"{name} ({', '.join(labels)})"

        return supported

    SUPPORTED_LANGUAGES = _parse_supported_languages()

    def get_supported_languages(self) -> dict[str, str]:
        """Return the language tags the chat template accepts, mapped to display names."""
        return self.SUPPORTED_LANGUAGES

    def __init__(self, model_name=None, max_tokens=4096, enable_thinking=False):
        self.model_name = model_name or LlamacppTranslator.DEFAULT_MODEL
        self.max_tokens = max_tokens
        # TranslateGemma's chat template has no reasoning/thinking section, so this is a
        # no-op for it; it is forwarded for thinking-capable models served by llama.cpp.
        self.enable_thinking = enable_thinking

    def _translate_one(self, text: str, target_language: str) -> str:
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
            # llama.cpp's OpenAI layer drops unknown content-part keys, so the language code
            # is passed as a template kwarg; chat_template.jinja reads it from there.
            "chat_template_kwargs": {
                "enable_thinking": self.enable_thinking,
                "target_lang_code": target_language,
            },
            "stream": False
        }

        response = requests.post(
            LlamacppTranslator.SERVER,
            json=payload,
            timeout=120
        )

        response.raise_for_status()

        return response.json()["choices"][0]["message"]["content"].strip()

    def translate(self, text: str, source_language: str, target_languages: list[str]) -> list[str]:
        # map() keeps the results in the same order as target_languages.
        return list(
            LlamacppTranslator._executor.map(
                partial(self._translate_one, text), target_languages
            )
        )

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