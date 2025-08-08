from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count, Sum
from .serializers import UserSerializer, UserRegistrationSerializer
from .models import User
from recipes.models import Recipe
from interactions.models import Like, Comment, Follow


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'token': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if email and password:
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'token': str(refresh.access_token),
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data

    # Debugging: print incoming request data
    print("Incoming data:", data)

    # Handle password update
    password = data.get('password', None)
    confirm_password = data.get('confirmPassword', None)

    if password and password != confirm_password:
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

    # Handle profile picture upload
    profile_picture = request.FILES.get('profile_picture')
    if profile_picture:
        data = data.copy()  # Make a mutable copy
        data['profile_picture'] = profile_picture

    # Update user profile
    serializer = UserSerializer(user, data=data, partial=True)
    if serializer.is_valid():
        # Handle password separately to ensure proper hashing
        if password:
            user.set_password(password)
            user.save()
            # Remove password from validated data to avoid double processing
            validated_data = serializer.validated_data
            validated_data.pop('password', None)
            serializer.update(user, validated_data)
        else:
            serializer.save()
        
        return Response(serializer.data)
    
    # Debugging: print serializer errors
    print("Serializer errors:", serializer.errors)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get user dashboard statistics"""
    user = request.user
    
    # Get user's recipes
    user_recipes = Recipe.objects.filter(author=user)
    total_recipes = user_recipes.count()
    
    # Get total likes on user's recipes
    total_likes = Like.objects.filter(recipe__author=user).count()
    
    # Get total comments on user's recipes
    total_comments = Comment.objects.filter(recipe__author=user, hidden=False).count()
    
    # Get followers count
    followers_count = Follow.objects.filter(following=user).count()
    
    # Get following count
    following_count = Follow.objects.filter(follower=user).count()
    
    return Response({
        'total_recipes': total_recipes,
        'total_likes': total_likes,
        'total_comments': total_comments,
        'followers_count': followers_count,
        'following_count': following_count
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_activity(request):
    """Get user's recent activity"""
    user = request.user
    
    activities = []
    
    # Get recent recipes created by user
    recent_recipes = Recipe.objects.filter(author=user).order_by('-created_at')[:5]
    for recipe in recent_recipes:
        activities.append({
            'type': 'recipe_created',
            'message': f'You created a new recipe: "{recipe.title}"',
            'timestamp': recipe.created_at.isoformat(),
            'recipe_id': recipe.id
        })
    
    # Get recent likes on user's recipes
    recent_likes = Like.objects.filter(recipe__author=user).order_by('-created_at')[:5]
    for like in recent_likes:
        activities.append({
            'type': 'recipe_liked',
            'message': f'Your recipe "{like.recipe.title}" was liked by {like.user.username}',
            'timestamp': like.created_at.isoformat(),
            'recipe_id': like.recipe.id
        })
    
    # Get recent comments on user's recipes
    recent_comments = Comment.objects.filter(recipe__author=user, hidden=False).order_by('-created_at')[:5]
    for comment in recent_comments:
        activities.append({
            'type': 'comment_received',
            'message': f'New comment on your recipe "{comment.recipe.title}" by {comment.user.username}',
            'timestamp': comment.created_at.isoformat(),
            'recipe_id': comment.recipe.id,
            'comment_id': comment.id
        })
    
    # Get recent followers
    recent_followers = Follow.objects.filter(following=user).order_by('-created_at')[:5]
    for follow in recent_followers:
        activities.append({
            'type': 'follower_gained',
            'message': f'{follow.follower.username} started following you',
            'timestamp': follow.created_at.isoformat(),
            'user_id': follow.follower.id
        })
    
    # Sort all activities by timestamp (most recent first)
    activities.sort(key=lambda x: x['timestamp'], reverse=True)
    
    # Return the most recent 20 activities
    return Response({
        'activities': activities[:20]
    })
