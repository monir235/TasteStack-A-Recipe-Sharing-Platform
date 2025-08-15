from rest_framework import serializers
from .models import Recipe, RecipeImage
from accounts.serializers import UserSerializer
from interactions.models import Rating, Like, Comment
import json


class RecipeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeImage
        fields = ('id', 'image', 'uploaded_at')


class RecipeSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    images = RecipeImageSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()
    likes_count = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()
    user_rating = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Recipe
        fields = (
            'id', 'title', 'description', 'ingredients', 'instructions',
            'prep_time', 'cook_time', 'servings', 'difficulty', 'category', 'image',
            'author', 'created_at', 'updated_at', 'images', 'average_rating',
            'likes_count', 'is_liked', 'user_rating'
        )
        read_only_fields = ('id', 'author', 'created_at', 'updated_at', 'images', 'average_rating', 'likes_count', 'is_liked', 'user_rating')
    
    def get_is_liked(self, obj):
        """Check if the current user has liked this recipe"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(user=request.user, recipe=obj).exists()
        return False
    
    def get_user_rating(self, obj):
        """Get the current user's rating for this recipe"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            rating = Rating.objects.filter(user=request.user, recipe=obj).first()
            return rating.rating if rating else None
        return None
    
    def get_image(self, obj):
        """Get the full URL for the recipe image"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class RecipeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = (
            'title', 'description', 'ingredients', 'instructions',
            'prep_time', 'cook_time', 'servings', 'difficulty', 'category', 'image'
        )
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set the parser classes to handle multipart/form-data
        self.fields['image'].allow_empty_file = True
        self.fields['image'].use_url = True

    def create(self, validated_data):
        user = self.context['request'].user
        # Remove author from validated_data if it exists to avoid duplicate keyword argument
        validated_data.pop('author', None)
        recipe = Recipe.objects.create(author=user, **validated_data)
        return recipe


class RecipeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = (
            'title', 'description', 'ingredients', 'instructions',
            'prep_time', 'cook_time', 'servings', 'difficulty', 'category', 'image'
        )
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set the parser classes to handle multipart/form-data
        self.fields['image'].allow_empty_file = True
        self.fields['image'].use_url = True
        
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance