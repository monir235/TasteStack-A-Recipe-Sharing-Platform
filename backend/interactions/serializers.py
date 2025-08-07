from rest_framework import serializers
from .models import Rating, Like, Comment
from accounts.serializers import UserSerializer
from recipes.serializers import RecipeSerializer


class RatingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Rating
        fields = ('id', 'user', 'recipe', 'rating', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')
        
    def create(self, validated_data):
        user = self.context['request'].user
        recipe = validated_data['recipe']
        
        # Check if user has already rated this recipe
        rating, created = Rating.objects.update_or_create(
            user=user,
            recipe=recipe,
            defaults={'rating': validated_data['rating']}
        )
        return rating


class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Like
        fields = ('id', 'user', 'recipe', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')
        
    def create(self, validated_data):
        user = self.context['request'].user
        recipe = validated_data['recipe']
        
        # Check if user has already liked this recipe
        like, created = Like.objects.get_or_create(
            user=user,
            recipe=recipe
        )
        return like


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ('id', 'user', 'recipe', 'content', 'hidden', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')
        
    def create(self, validated_data):
        user = self.context['request'].user
        recipe = validated_data['recipe']
        
        # Check if user has already commented on this recipe
        comment, created = Comment.objects.update_or_create(
            user=user,
            recipe=recipe,
            defaults={'content': validated_data['content']}
        )
        return comment