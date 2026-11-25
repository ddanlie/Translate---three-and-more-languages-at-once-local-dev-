from django.contrib.auth.models import AnonymousUser
from django.test import SimpleTestCase
from rest_framework.test import APIRequestFactory

from config.throttling import AnonRateThrottle, UserRateThrottle


class _FixedRateUserThrottle(UserRateThrottle):
    rate = "1/3s"


class SecondsRateThrottleTests(SimpleTestCase):
    def test_parses_multi_second_window(self):
        throttle = AnonRateThrottle()
        self.assertEqual(throttle.parse_rate("1/3s"), (1, 3))
        self.assertEqual(throttle.parse_rate("5/30s"), (5, 30))

    def test_falls_back_to_drf_units(self):
        throttle = AnonRateThrottle()
        self.assertEqual(throttle.parse_rate("10/min"), (10, 60))
        self.assertEqual(throttle.parse_rate("2/h"), (2, 3600))

    def test_second_request_within_window_is_throttled(self):
        throttle = _FixedRateUserThrottle()
        throttle.cache.clear()

        request = APIRequestFactory().get("/")
        request.user = AnonymousUser()

        self.assertTrue(throttle.allow_request(request, None))
        self.assertFalse(throttle.allow_request(request, None))
