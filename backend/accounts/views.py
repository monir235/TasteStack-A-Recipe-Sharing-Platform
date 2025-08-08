from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import models
from django.db.models import Count, Sum, Avg
from .serializers import UserSerializer, UserRegistrationSerializer
from .models import User
from recipes.models import Recipe
from interactions.models import Like, Comment, Follow


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    # Debug logging
    print("=== REGISTRATION DEBUG ===")
    print(f"Request method: {request.method}")
    print(f"Request data: {request.data}")
    print(f"Request content type: {request.content_type}")
    print(f"Request META (partial): {dict(list(request.META.items())[:10])}")
    
    # Basic validation
    required_fields = ['username', 'email', 'password', 'password_confirm']
    missing_fields = [field for field in required_fields if field not in request.data]
    
    if missing_fields:
        print(f"Missing required fields: {missing_fields}")
        return Response(
            {'error': f'Missing required fields: {", ".join(missing_fields)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check for existing users
    existing_email = User.objects.filter(email=request.data.get('email')).first()
    if existing_email:
        print(f"User with email {request.data.get('email')} already exists")
        return Response(
            {'email': ['User with this email already exists.']},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    existing_username = User.objects.filter(username=request.data.get('username')).first()
    if existing_username:
        print(f"User with username {request.data.get('username')} already exists")
        return Response(
            {'username': ['User with this username already exists.']},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    serializer = UserRegistrationSerializer(data=request.data)
    print(f"Serializer data: {serializer.initial_data}")
    
    if serializer.is_valid():
        print("Serializer is valid, creating user...")
        try:
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            print(f"User created successfully: {user.email}")
            return Response({
                'user': UserSerializer(user).data,
                'token': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error creating user: {e}")
            return Response(
                {'error': 'Failed to create user. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    print(f"Serializer validation failed. Errors: {serializer.errors}")
    print("=== END REGISTRATION DEBUG ===")
    
    # Format errors for better frontend handling
    formatted_errors = {}
    for field, errors in serializer.errors.items():
        if isinstance(errors, list):
            formatted_errors[field] = errors[0] if errors else 'Invalid value'
        else:
            formatted_errors[field] = str(errors)
    
    return Response(formatted_errors, status=status.HTTP_400_BAD_REQUEST)


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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request, user_id):
    try:
        target_user = User.objects.get(id=user_id)
        if target_user == request.user:
            return Response({'error': 'Cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)
        
        follow_obj, created = Follow.objects.get_or_create(
            follower=request.user, 
            following=target_user
        )
        
        if not created:
            # Already following, so unfollow
            follow_obj.delete()
            return Response({'following': False, 'message': 'Unfollowed successfully'})
        else:
            # New follow
            return Response({'following': True, 'message': 'Followed successfully'})
            
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_profile(request, user_id):
    """Get public profile view of a user"""
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get user's public recipes
    user_recipes = Recipe.objects.filter(author=user).order_by('-created_at')
    total_recipes = user_recipes.count()
    
    # Get total likes on user's recipes
    total_likes = Like.objects.filter(recipe__author=user).count()
    
    # Get average rating of user's recipes
    avg_rating = user_recipes.aggregate(
        avg_rating=models.Avg('ratings__rating')
    )['avg_rating'] or 0
    
    # Get followers/following count
    followers_count = Follow.objects.filter(following=user).count()
    following_count = Follow.objects.filter(follower=user).count()
    
    # Check if current user is following this user (if authenticated)
    is_following = False
    if request.user.is_authenticated and request.user != user:
        is_following = Follow.objects.filter(follower=request.user, following=user).exists()
    
    # Serialize user data (exclude sensitive info for public view)
    user_data = {
        'id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'bio': user.bio,
        'location': user.location,
        'website': user.website,
        'profile_picture': user.profile_picture.url if user.profile_picture else None,
        'date_joined': user.date_joined,
    }
    
    # Get recent recipes (limit to 6 for preview)
    from recipes.serializers import RecipeSerializer
    recent_recipes = user_recipes[:6]
    recipe_serializer = RecipeSerializer(recent_recipes, many=True, context={'request': request})
    
    return Response({
        'user': user_data,
        'stats': {
            'total_recipes': total_recipes,
            'total_likes': total_likes,
            'average_rating': round(avg_rating, 1) if avg_rating else 0,
            'followers_count': followers_count,
            'following_count': following_count,
        },
        'recent_recipes': recipe_serializer.data,
        'is_following': is_following,
    })
