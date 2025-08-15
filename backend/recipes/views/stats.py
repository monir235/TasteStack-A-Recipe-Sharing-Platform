from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Count, Avg
from ..models import Recipe
from accounts.models import User
from interactions.models import Rating, Like, Comment
from django.utils import timezone
from datetime import datetime, timedelta


@api_view(['GET'])
@permission_classes([AllowAny])
def platform_statistics(request):
    """
    Get platform statistics from the database
    """
    try:
        # Count total recipes
        total_recipes = Recipe.objects.count()
        
        # Count total users (chefs)
        total_users = User.objects.count()
        
        # Count total ratings (reviews)
        total_ratings = Rating.objects.count()
        
        # Count total likes
        total_likes = Like.objects.count()
        
        # Count total comments
        total_comments = Comment.objects.count()
        

        
        # Get platform start year (from the first user registration)
        first_user = User.objects.order_by('date_joined').first()
        founded_year = first_user.date_joined.year if first_user else timezone.now().year
        
        # Calculate average rating
        avg_rating = Rating.objects.aggregate(avg_rating=Avg('rating'))['avg_rating']
        platform_rating = round(avg_rating, 1) if avg_rating else 5.0
        
        # Recent activity (recipes created in the last 30 days)
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        recent_recipes = Recipe.objects.filter(created_at__gte=thirty_days_ago).count()
        
        # Active users (users who have created recipes, ratings, or comments)
        active_users = User.objects.filter(
            recipes__isnull=False
        ).distinct().count()
        
        statistics = {
            'total_recipes': total_recipes,
            'total_users': total_users,
            'total_ratings': total_ratings,
            'total_likes': total_likes,
            'total_comments': total_comments,
            'founded_year': founded_year,
            'platform_rating': platform_rating,
            'recent_recipes': recent_recipes,
            'active_users': active_users,
            # Derived stats for display
            'happy_chefs': active_users,  # Users who have created content
            'recipes_shared': total_recipes,
        }
        
        return Response(statistics)
        
    except Exception as e:
        # Return default/safe values in case of error
        return Response({
            'total_recipes': 0,
            'total_users': 0,
            'total_ratings': 0,
            'total_likes': 0,
            'total_comments': 0,
            'founded_year': timezone.now().year,
            'platform_rating': 5.0,
            'recent_recipes': 0,
            'active_users': 0,
            'happy_chefs': 0,
            'recipes_shared': 0,
            'error': str(e)
        })
