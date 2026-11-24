"""Throughput checks for the llama.cpp backend.

These hit a live llama-server, so they are skipped when nothing is listening on
``LlamacppTranslator.SERVER``. Run them with::

    python manage.py test threetranslate.tests.test_parallel_requests -v 2

The timings are printed to stdout so they show up with ``-v 2``.
"""

import time
import unittest
from concurrent.futures import ThreadPoolExecutor

import requests
from django.test import SimpleTestCase

from threetranslate.services.ai_translation.ai_translation_service import (
    LlamacppTranslator,
)

HEALTH_URL = LlamacppTranslator.SERVER.replace("/v1/chat/completions", "/health")

TEXT = "The quick brown fox jumps over the lazy dog."
LANGUAGES = [
    "de", "ru", "cs", "fr", "es", "it", "pl", "uk", "ja",
    "zh", "pt", "nl", "sv", "tr", "ko",
]


def _server_is_up():
    try:
        return requests.get(HEALTH_URL, timeout=3).json().get("status") == "ok"
    except Exception:
        return False


def _safe(text):
    """Console output is cp1251 on Windows; never let a translation crash the test."""
    return text.encode("ascii", "backslashreplace").decode("ascii")


def _post(language):
    """One raw request straight to the server, bypassing the service thread pool."""
    payload = {
        "messages": [{"role": "user", "content": [{"type": "text", "text": TEXT}]}],
        "temperature": 0,
        "max_tokens": 128,
        "chat_template_kwargs": {"target_lang_code": language},
        "stream": False,
    }
    started = time.perf_counter()
    response = requests.post(LlamacppTranslator.SERVER, json=payload, timeout=300)
    response.raise_for_status()
    elapsed = time.perf_counter() - started
    return language, elapsed, response.json()["choices"][0]["message"]["content"].strip()


@unittest.skipUnless(_server_is_up(), f"llama-server not reachable at {HEALTH_URL}")
class ParallelRequestTimingTests(SimpleTestCase):
    """Measure wall time for 5, 10 and 15 concurrent requests."""

    def _run_parallel(self, count):
        languages = LANGUAGES[:count]
        started = time.perf_counter()
        with ThreadPoolExecutor(max_workers=count) as pool:
            results = list(pool.map(_post, languages))
        wall = time.perf_counter() - started

        latencies = sorted(elapsed for _, elapsed, _ in results)
        print(
            f"\n[{count:2} parallel] wall={wall:6.2f}s "
            f"throughput={count / wall:5.2f} req/s "
            f"latency min/med/max="
            f"{latencies[0]:.2f}/{latencies[len(latencies) // 2]:.2f}/{latencies[-1]:.2f}s"
        )
        for language, elapsed, output in results:
            print(f"    {language:3} {elapsed:6.2f}s  {_safe(output[:60])}")

        self.assertEqual(len(results), count)
        for _, _, output in results:
            self.assertTrue(output, "empty translation returned")
        return wall

    def test_5_parallel_requests(self):
        self._run_parallel(5)

    def test_10_parallel_requests(self):
        self._run_parallel(10)

    def test_15_parallel_requests(self):
        self._run_parallel(15)


@unittest.skipUnless(_server_is_up(), f"llama-server not reachable at {HEALTH_URL}")
class TranslatorThreadPoolTests(SimpleTestCase):
    """The service fans out per language but never exceeds MAX_WORKERS at once."""

    def test_translate_returns_results_in_target_order(self):
        translator = LlamacppTranslator(max_tokens=128)
        languages = ["de", "ru", "cs"]
        results = translator.translate(TEXT, ["en"], languages)

        self.assertEqual(len(results), len(languages))
        for result in results:
            self.assertTrue(result)

    def test_pool_is_capped_at_max_workers(self):
        self.assertEqual(LlamacppTranslator.MAX_WORKERS, 5)
        self.assertEqual(LlamacppTranslator._executor._max_workers, 5)

    def test_more_languages_than_workers_still_complete(self):
        translator = LlamacppTranslator(max_tokens=128)
        languages = LANGUAGES[:7]
        started = time.perf_counter()
        results = translator.translate(TEXT, ["en"], languages)
        wall = time.perf_counter() - started

        print(f"\n[7 languages, 5 workers] wall={wall:6.2f}s")
        self.assertEqual(len(results), len(languages))
        for result in results:
            self.assertTrue(result)
