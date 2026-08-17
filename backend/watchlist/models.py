from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Media(models.Model):
    class MediaType(models.TextChoices):
        MOVIE = 'Movie', 'Movie'
        TV_SHOW = 'TV Show', 'TV Show'

    class MediaStatus(models.TextChoices):
        UNWATCHED = 'Unwatched', 'To Watch'
        WATCHED = 'Watched', 'Watched'

    title = models.CharField(max_length=255)
    type = models.CharField(
        max_length=20,
        choices=MediaType.choices,
        default=MediaType.MOVIE
    )
    status = models.CharField(
        max_length=20,
        choices=MediaStatus.choices,
        default=MediaStatus.UNWATCHED
    )
    rating = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='media_items'
    )
    description = models.TextField(blank=True, null=True)
    poster = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Media'
        verbose_name_plural = 'Media Items'

    def __str__(self):
        return f"{self.title} ({self.type}) - {self.status}"
