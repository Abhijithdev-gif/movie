from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MediaViewSet, StatsView, register_api, login_api, logout_api, current_user_api

router = DefaultRouter()
router.register(r'media', MediaViewSet, basename='media')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', StatsView.as_view(), name='stats'),
    path('auth/register/', register_api, name='register'),
    path('auth/login/', login_api, name='login'),
    path('auth/logout/', logout_api, name='logout'),
    path('auth/me/', current_user_api, name='current_user'),
]
