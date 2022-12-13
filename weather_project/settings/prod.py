from .base import *
from decouple import config

SECRET_KEY = config('SECRET_KEY')

DEBUG = False

ALLOWED_HOSTS = ['http://127.0.0.1:8000',]

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

CSP_DEFAULT_SRC = ("self",)
CSP_STYLE_SRC = ("self",)
CSP_SCRIPT_SRC = ("self",)
CSP_IMG_SRC = ("self",)
CSP_FONT_SRC = ("self",)

SECURE_HSTS_SECONDS = 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

SECURE_SSL_REDIRECT = True