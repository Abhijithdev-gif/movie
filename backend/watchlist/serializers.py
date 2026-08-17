from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Media


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=4)
    email = serializers.EmailField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', '')
        )
        return user


class MediaSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Media
        fields = [
            'id', 'title', 'type', 'status', 'rating',
            'owner', 'description', 'poster', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value.strip()

    def validate_rating(self, value):
        if value < 0 or value > 5:
            raise serializers.ValidationError("Rating must be between 0 and 5.")
        return value

    def validate_type(self, value):
        valid_types = [Media.MediaType.MOVIE, Media.MediaType.TV_SHOW]
        if value not in valid_types:
            raise serializers.ValidationError(f"Type must be one of {valid_types}.")
        return value

    def validate_status(self, value):
        valid_statuses = [Media.MediaStatus.UNWATCHED, Media.MediaStatus.WATCHED]
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Status must be one of {valid_statuses}.")
        return value
