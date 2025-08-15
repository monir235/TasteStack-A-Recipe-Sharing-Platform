from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db import models
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Recipe
from ..serializers import RecipeSerializer, RecipeCreateSerializer, RecipeUpdateSerializer
from interactions.models import Rating
from interactions.serializers import RatingSerializer


class RecipeListCreateView(generics.ListCreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['difficulty']
    
    def get_queryset(self):
        queryset = Recipe.objects.all()
        
        # Category filter
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__icontains=category)
        
        # Search query
        search = self.request.query_params.get('q', None)
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(description__icontains=search) |
                models.Q(ingredients__icontains=search)
            )
        
        # Difficulty filter
        difficulty = self.request.query_params.get('difficulty', None)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        # Max time filter
        max_time = self.request.query_params.get('max_time', None)
        if max_time:
            try:
                max_time_int = int(max_time)
                queryset = queryset.filter(
                    models.Q(prep_time__lte=max_time_int) |
                    models.Q(cook_time__lte=max_time_int)
                )
            except ValueError:
                pass
        
        # Author filter
        author = self.request.query_params.get('author', None)
        if author:
            queryset = queryset.filter(
                models.Q(author__username__icontains=author) |
                models.Q(author__first_name__icontains=author) |
                models.Q(author__last_name__icontains=author)
            )
        
        # Min rating filter
        min_rating = self.request.query_params.get('min_rating', None)
        if min_rating:
            try:
                min_rating_float = float(min_rating)
                # Filter recipes with average rating >= min_rating
                from django.db.models import Avg
                queryset = queryset.annotate(
                    avg_rating=Avg('ratings__rating')
                ).filter(avg_rating__gte=min_rating_float)
            except ValueError:
                pass
        
        return queryset
    search_fields = ['title', 'description', 'ingredients']
    ordering_fields = ['created_at', 'average_rating']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RecipeCreateSerializer
        return RecipeSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return RecipeUpdateSerializer
        return RecipeSerializer
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Check if user is the author of the recipe
        if instance.author != request.user:
            return Response(
                {'error': 'You do not have permission to edit this recipe'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if user is the author of the recipe
        if instance.author != request.user:
            return Response(
                {'error': 'You do not have permission to delete this recipe'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_recipe(request, pk):
    try:
        recipe = Recipe.objects.get(pk=pk)
    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = RatingSerializer(data={'recipe': recipe.id, 'rating': request.data.get('rating')}, 
                                 context={'request': request})
    if serializer.is_valid():
        serializer.save()
        # Return updated recipe with new average rating
        recipe_serializer = RecipeSerializer(recipe)
        return Response(recipe_serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def search_recipes(request):
    query = request.GET.get('q', '')
    if query:
        recipes = Recipe.objects.filter(
            models.Q(title__icontains=query) |
            models.Q(description__icontains=query) |
            models.Q(ingredients__icontains=query)
        ).distinct()
    else:
        recipes = Recipe.objects.all()
    
    # Apply pagination
    page = request.GET.get('page', 1)
    page_size = request.GET.get('page_size', 12)
    
    serializer = RecipeSerializer(recipes, many=True)
    return Response({
        'results': serializer.data,
        'count': recipes.count(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_recipes(request):
    """Get current user's recipes"""
    user = request.user
    recipes = Recipe.objects.filter(author=user).order_by('-created_at')
    
    # Apply pagination
    page = request.GET.get('page', 1)
    page_size = request.GET.get('page_size', 12)
    
    serializer = RecipeSerializer(recipes, many=True)
    return Response({
        'results': serializer.data,
        'count': recipes.count(),
    })
