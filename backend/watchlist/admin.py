from django.contrib import admin
from .models import Media


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'type', 'status', 'rating', 'owner', 'created_at')
    list_filter = ('status', 'type', 'rating', 'created_at')
    search_fields = ('title', 'description', 'owner__username')
    ordering = ('-created_at',)
