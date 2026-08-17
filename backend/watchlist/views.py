from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Avg, Q

from .models import Media
from .serializers import MediaSerializer, UserSerializer, RegisterSerializer


class MediaViewSet(viewsets.ModelViewSet):
    serializer_class = MediaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Media.objects.none()

        queryset = Media.objects.filter(owner=user)

        # Status filter
        status_param = self.request.query_params.get('status', None)
        if status_param:
            # handle case insensitive or exact match
            if status_param.lower() in ['unwatched', 'to watch', 'to_watch']:
                queryset = queryset.filter(status=Media.MediaStatus.UNWATCHED)
            elif status_param.lower() == 'watched':
                queryset = queryset.filter(status=Media.MediaStatus.WATCHED)

        # Type filter
        type_param = self.request.query_params.get('type', None)
        if type_param:
            if type_param.lower() == 'movie':
                queryset = queryset.filter(type=Media.MediaType.MOVIE)
            elif type_param.lower() in ['tv', 'tv show', 'tv_show']:
                queryset = queryset.filter(type=Media.MediaType.TV_SHOW)

        # Search filter
        search_param = self.request.query_params.get('search', None)
        if search_param:
            queryset = queryset.filter(
                Q(title__icontains=search_param) | Q(description__icontains=search_param)
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class StatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_media = Media.objects.filter(owner=user)

        total = user_media.count()
        to_watch = user_media.filter(status=Media.MediaStatus.UNWATCHED).count()
        watched_items = user_media.filter(status=Media.MediaStatus.WATCHED)
        watched = watched_items.count()

        avg_rating_val = watched_items.aggregate(Avg('rating'))['rating__avg']
        avg_rating = round(avg_rating_val, 1) if avg_rating_val is not None else 0.0

        recently_watched = MediaSerializer(
            watched_items.order_by('-updated_at')[:5],
            many=True
        ).data

        return Response({
            'total': total,
            'to_watch': to_watch,
            'watched': watched,
            'avg_rating': avg_rating,
            'recently_watched': recently_watched
        })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@authentication_classes([])
def register_api(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        return Response({
            'message': 'Registration successful',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@authentication_classes([])
def login_api(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'detail': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data
        })
    return Response({'detail': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)



@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_api(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def current_user_api(request):
    if request.user.is_authenticated:
        return Response({
            'isAuthenticated': True,
            'user': UserSerializer(request.user).data
        })
    return Response({
        'isAuthenticated': False,
        'user': None
    })
