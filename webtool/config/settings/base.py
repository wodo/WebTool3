"""
Django settings for config project.

Generated by 'django-admin startproject' using Django 1.11.2.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

import os
from django.core.exceptions import ImproperlyConfigured


def get_env(name):
    try:
        return os.environ[name]
    except KeyError:
        raise ImproperlyConfigured("environment variable '{}' is missing.".format(name))


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# See https://docs.djangoproject.com/en/1.11/ref/contrib/sites/
SITE_ID = 1

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_env('DJCODE_SECRET_KEY')

# Application definition

INSTALLED_APPS = [
    'apps.WebtoolAdminConfig',
    'django.contrib.sites',
    'django.contrib.redirects',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.staticfiles',
    'django.contrib.messages',
    'rest_framework',
    'django_filters',
    'corsheaders',
    'server',
    'admin_reorder',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.contrib.redirects.middleware.RedirectFallbackMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'admin_reorder.middleware.ModelAdminReorder',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': get_env('DJCODE_DB_ENGINE'),
        'HOST': get_env('DJCODE_DB_HOST'),
        'PORT': get_env('DJCODE_DB_PORT'),
        'NAME': get_env('DJCODE_DB_NAME'),
        'USER': get_env('DJCODE_DB_USER'),
        'PASSWORD': get_env('DJCODE_DB_PASSWORD'),
    }
}

# Cache
# https://docs.djangoproject.com/en/1.11/topics/cache/#database-caching
# https://docs.djangoproject.com/en/1.11/ref/settings/#caches

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'wt3_cache',
    }
}

AUTHENTICATION_BACKENDS = [
    'server.backend.Backend',
    'django.contrib.auth.backends.ModelBackend'
]

# http://www.django-rest-framework.org/api-guide/filtering/

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter'
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    )
}

# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'de-DE'

TIME_ZONE = 'Europe/Berlin'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'


# use pip3.6 install django-modeladmin-reorder before using & register app in settings + middleware

ADMIN_REORDER = (
    {'app': 'auth', 'models': ('auth.User', 'auth.Group')},
    {'app': 'server', 'label': 'Kalender', 'models': ('server.Vacation', 'server.Anniversary', 'server.Calendar')},
    {'app': 'server', 'label': 'Gruppen', 'models': ('server.Collective', 'server.Session')},
    {'app': 'server', 'label': 'Qualifikationen', 'models': ('server.Qualification', 'server.QualificationGroup')},
    {'app': 'server', 'label': 'Events', 'models': ('server.Equipment', 'server.Tour', 'server.Category', 'server.CategoryGroup')},
    {'app': 'server', 'label': 'Instructions', 'models': ('server.Instruction', 'server.Topic',)},
    'sites'
)
