from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root_index_view(request):
    return JsonResponse({
        'status': 'online',
        'app': 'Movie List API',
        'message': 'Backend service is running successfully on Vercel.',
        'endpoints': {
            'api_root': '/api/',
            'auth_register': '/api/auth/register/',
            'auth_login': '/api/auth/login/',
            'auth_logout': '/api/auth/logout/',
            'auth_me': '/api/auth/me/',
            'media': '/api/media/',
            'stats': '/api/stats/'
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('watchlist.urls')),
    path('', root_index_view, name='root_index'),
]
