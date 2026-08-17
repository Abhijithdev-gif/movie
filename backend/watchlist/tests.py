from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Media


class WatchlistApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password123')

        self.media1 = Media.objects.create(
            title='Inception',
            type=Media.MediaType.MOVIE,
            status=Media.MediaStatus.UNWATCHED,
            owner=self.user1,
            description='A mind-bending thriller'
        )
        self.media2 = Media.objects.create(
            title='Breaking Bad',
            type=Media.MediaType.TV_SHOW,
            status=Media.MediaStatus.WATCHED,
            rating=5,
            owner=self.user1,
            description='Chemistry teacher turned drug kingpin'
        )

    def test_unauthenticated_access_denied(self):
        response = self.client.get('/api/media/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_list_own_media(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.get('/api/media/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_user_isolation(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.get('/api/media/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_create_media(self):
        self.client.force_authenticate(user=self.user1)
        data = {
            'title': 'The Matrix',
            'type': 'Movie',
            'status': 'Unwatched',
            'description': 'Sci-fi classic'
        }
        response = self.client.post('/api/media/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'The Matrix')
        self.assertEqual(response.data['owner'], 'user1')

    def test_invalid_rating(self):
        self.client.force_authenticate(user=self.user1)
        data = {
            'title': 'Bad Movie',
            'type': 'Movie',
            'status': 'Watched',
            'rating': 10  # Exceeds max 5
        }
        response = self.client.post('/api/media/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_filter_status_and_type(self):
        self.client.force_authenticate(user=self.user1)
        res_watched = self.client.get('/api/media/?status=watched')
        self.assertEqual(len(res_watched.data), 1)
        self.assertEqual(res_watched.data[0]['title'], 'Breaking Bad')

        res_movie = self.client.get('/api/media/?type=movie')
        self.assertEqual(len(res_movie.data), 1)
        self.assertEqual(res_movie.data[0]['title'], 'Inception')

    def test_stats_endpoint(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.get('/api/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total'], 2)
        self.assertEqual(response.data['to_watch'], 1)
        self.assertEqual(response.data['watched'], 1)
        self.assertEqual(response.data['avg_rating'], 5.0)

    def test_auth_flow(self):
        # Register test
        reg_resp = self.client.post('/api/auth/register/', {
            'username': 'newuser',
            'password': 'newpassword'
        })
        self.assertEqual(reg_resp.status_code, status.HTTP_201_CREATED)

        # Login test
        login_resp = self.client.post('/api/auth/login/', {
            'username': 'newuser',
            'password': 'newpassword'
        })
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)
