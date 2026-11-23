from rest_framework.throttling import AnonRateThrottle as DRFAnonRateThrottle
from rest_framework.throttling import UserRateThrottle as DRFUserRateThrottle


_UNIT_SECONDS = {"s": 1, "m": 60, "h": 3600, "d": 86400}


class RateMixin:
    """Adds support for arbitrary windows in rate strings, e.g. "1/3s" or "2/5m".

    DRF's own parser only understands a single unit character
    ("s", "m", "h", "d"), so "1/3s" would raise a KeyError.
    """

    def parse_rate(self, rate):
        if rate is None:
            return (None, None)
        num, period = rate.split("/")
        if period[:-1].isdigit() and period[-1] in _UNIT_SECONDS:
            return int(num), int(period[:-1]) * _UNIT_SECONDS[period[-1]]
        return super().parse_rate(rate)


class AnonRateThrottle(RateMixin, DRFAnonRateThrottle):
    pass


class UserRateThrottle(RateMixin, DRFUserRateThrottle):
    pass
