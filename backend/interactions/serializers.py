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
    recipe = serializers.SerializerMethodField(read_only=True)
    recipe_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Comment
        fields = ('id', 'user', 'recipe', 'recipe_id', 'content', 'hidden', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')
    
    def get_recipe(self, obj):
        """Return basic recipe information"""
        return {
            'id': obj.recipe.id,
            'title': obj.recipe.title,
            'author': obj.recipe.author.username
        }
        
    def create(self, validated_data):
        user = self.context['request'].user
        recipe_id = validated_data.pop('recipe_id')
        
        # Get the recipe object
        from recipes.models import Recipe
        recipe = Recipe.objects.get(id=recipe_id)
        
        # Create a new comment (users can comment multiple times)
        comment = Comment.objects.create(
            user=user,
            recipe=recipe,
            content=validated_data['content']
        )
        return comment
