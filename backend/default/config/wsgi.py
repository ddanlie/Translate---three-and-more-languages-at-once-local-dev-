"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from dotenv import load_dotenv

load_dotenv()
ENVIRONMENT = os.environ.get("ENVIRONMENT", "development")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", f"config.settings.{ENVIRONMENT}")

application = get_wsgi_application()
