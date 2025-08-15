from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.html import escape
import os
from .models import Like, Comment
from .serializers import LikeSerializer, CommentSerializer
from recipes.models import Recipe


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_recipe(request, recipe_id):
    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = LikeSerializer(data={'recipe': recipe.id}, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Recipe liked successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unlike_recipe(request, recipe_id):
    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        like = Like.objects.get(user=request.user, recipe=recipe)
        like.delete()
        return Response({'message': 'Recipe unliked successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Like.DoesNotExist:
        return Response({'error': 'You have not liked this recipe'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_recipe_comments(request, recipe_id):
    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
    
    comments = Comment.objects.filter(recipe=recipe)
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request, recipe_id):
    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CommentSerializer(data={'recipe': recipe.id, 'content': request.data.get('content')},
                                 context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_comment(request, recipe_id, comment_id):
    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        comment = Comment.objects.get(pk=comment_id, recipe=recipe)
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if the user is the owner of the comment
    if comment.user != request.user:
        return Response({'error': 'You do not have permission to edit this comment'}, status=status.HTTP_403_FORBIDDEN)
    
    # Update the comment content with validation
    new_content = request.data.get('content', comment.content)
    # Sanitize content to prevent path traversal and XSS
    if new_content:
        # Remove any path traversal attempts
        new_content = new_content.replace('../', '').replace('..\\', '')
        # Escape HTML to prevent XSS
        new_content = escape(new_content)
        comment.content = new_content
    comment.save()
    
    serializer = CommentSerializer(comment)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def hide_comment(request, recipe_id, comment_id):
    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        comment = Comment.objects.get(pk=comment_id, recipe=recipe)
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if the user is the owner of the comment or the owner of the recipe
    if comment.user != request.user and recipe.author != request.user:
        return Response({'error': 'You do not have permission to hide this comment'}, status=status.HTTP_403_FORBIDDEN)
    
    # Hide the comment
    comment.hidden = True
    comment.save()
    
    return Response({'message': 'Comment hidden successfully'}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comment(request, recipe_id, comment_id):
    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        comment = Comment.objects.get(pk=comment_id, recipe=recipe)
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if the user is the owner of the comment or the owner of the recipe
    if comment.user != request.user and recipe.author != request.user:
        return Response({'error': 'You do not have permission to delete this comment'}, status=status.HTTP_403_FORBIDDEN)
    
    comment.delete()
    return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_comments_on_my_recipes(request):
    """Get all comments on the current user's recipes for moderation"""
    user = request.user
    
    # Get all comments on user's recipes
    comments = Comment.objects.filter(
        recipe__author=user
    ).select_related('user', 'recipe').order_by('-created_at')
    
    serializer = CommentSerializer(comments, many=True)
    return Response({
        'comments': serializer.data
    })
