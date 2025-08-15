from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db import models
from django_filters.rest_framework import DjangoFilterBackend
from .models import Recipe
from .serializers import RecipeSerializer, RecipeCreateSerializer, RecipeUpdateSerializer
from interactions.models import Rating
from interactions.serializers import RatingSerializer


class RecipeListCreateView(generics.ListCreateAPIView):
    queryset = Recipe.objects.select_related('author').all()
    serializer_class = RecipeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['author']
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
    queryset = Recipe.objects.select_related('author').all()
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
    category = request.GET.get('category', '')
    difficulty = request.GET.get('difficulty', '')
    max_time = request.GET.get('max_time', '')
    ingredients = request.GET.get('ingredients', '')  # New: specific ingredient search
    author = request.GET.get('author', '')  # New: specific author search
    min_rating = request.GET.get('min_rating', '')  # New: minimum rating filter
    
    recipes = Recipe.objects.select_related('author').all()
    
    if query:
        # Enhanced search with word tokenization and better relevance
        query_words = query.lower().split()
        search_query = models.Q()
        
        for word in query_words:
            word_query = (
                models.Q(title__icontains=word) |
                models.Q(description__icontains=word) |
                models.Q(ingredients__icontains=word) |
                models.Q(instructions__icontains=word) |
                models.Q(difficulty__icontains=word)
            )
            search_query &= word_query  # AND logic for multiple words
        
        # Also include author search
        author_query = models.Q()
        for word in query_words:
            author_query |= (
                models.Q(author__first_name__icontains=word) |
                models.Q(author__last_name__icontains=word) |
                models.Q(author__username__icontains=word)
            )
        
        # Combine main search with author search using OR
        recipes = recipes.filter(search_query | author_query).distinct()
    
    # Filter by category (map category to relevant search terms)
    if category:
        category_keywords = {
            'breakfast': ['breakfast', 'morning', 'cereal', 'toast', 'pancake', 'waffle', 'egg'],
            'lunch': ['lunch', 'sandwich', 'salad', 'soup', 'wrap'],
            'dinner': ['dinner', 'main', 'steak', 'chicken', 'fish', 'pasta', 'rice'],
            'desserts': ['dessert', 'sweet', 'cake', 'cookie', 'pie', 'ice cream', 'chocolate'],
            'appetizers': ['appetizer', 'starter', 'snack', 'dip', 'wings'],
            'snacks': ['snack', 'bite', 'finger food', 'chips'],
            'italian': ['italian', 'pasta', 'pizza', 'risotto', 'lasagna', 'spaghetti'],
            'asian': ['asian', 'chinese', 'japanese', 'thai', 'korean', 'sushi', 'ramen', 'curry'],
            'mexican': ['mexican', 'taco', 'burrito', 'salsa', 'guacamole', 'enchilada'],
            'indian': ['indian', 'curry', 'spicy', 'masala', 'biryani', 'naan'],
            'mediterranean': ['mediterranean', 'olive', 'feta', 'hummus', 'greek'],
            'american': ['american', 'burger', 'fries', 'bbq', 'hot dog'],
            'vegetarian': ['vegetarian', 'veggie', 'plant', 'vegetable'],
            'vegan': ['vegan', 'plant-based', 'dairy-free'],
            'gluten-free': ['gluten-free', 'gluten free', 'celiac'],
            'keto': ['keto', 'ketogenic', 'low-carb', 'low carb'],
            'healthy': ['healthy', 'light', 'fresh', 'nutritious'],
            'quick': ['quick', 'fast', 'easy', '15 min', '20 min', '30 min'],
        }
        
        if category in category_keywords:
            category_query = models.Q()
            for keyword in category_keywords[category]:
                category_query |= (
                    models.Q(title__icontains=keyword) |
                    models.Q(description__icontains=keyword) |
                    models.Q(ingredients__icontains=keyword) |
                    models.Q(instructions__icontains=keyword)
                )
            recipes = recipes.filter(category_query)
    
    # Filter by specific ingredients
    if ingredients:
        ingredient_words = ingredients.lower().split(',')
        for ingredient in ingredient_words:
            ingredient = ingredient.strip()
            if ingredient:
                recipes = recipes.filter(ingredients__icontains=ingredient)
    
    # Filter by specific author
    if author:
        recipes = recipes.filter(
            models.Q(author__first_name__icontains=author) |
            models.Q(author__last_name__icontains=author) |
            models.Q(author__username__icontains=author)
        ).distinct()
    
    # Filter by minimum rating
    if min_rating:
        try:
            min_rating_float = float(min_rating)
            recipes = recipes.filter(average_rating__gte=min_rating_float)
        except ValueError:
            pass  # Ignore invalid rating values
    
    # Filter by difficulty
    if difficulty:
        recipes = recipes.filter(difficulty__iexact=difficulty)
    
    # Filter by maximum cooking time
    if max_time:
        try:
            max_time_int = int(max_time)
            # Use database functions for total time calculation
            from django.db.models import F
            recipes = recipes.annotate(
                total_time=F('prep_time') + F('cook_time')
            ).filter(total_time__lte=max_time_int)
        except ValueError:
            pass  # Ignore invalid max_time values
    
    # Order by relevance (recipes with query in title first, then by creation date)
    if query:
        # Use annotation for better database compatibility
        from django.db.models import Case, When, IntegerField, Value
        recipes = recipes.annotate(
            title_match=Case(
                When(title__icontains=query, then=Value(1)),
                default=Value(0),
                output_field=IntegerField()
            )
        ).order_by('-title_match', '-created_at')
    else:
        recipes = recipes.order_by('-created_at')
    
    # Apply pagination
    page = request.GET.get('page', 1)
    page_size = request.GET.get('page_size', 12)
    
    try:
        page = int(page)
        page_size = int(page_size)
    except ValueError:
        page = 1
        page_size = 12
    
    # Calculate pagination
    total_count = recipes.count()
    start = (page - 1) * page_size
    end = start + page_size
    
    paginated_recipes = recipes[start:end]
    
    serializer = RecipeSerializer(paginated_recipes, many=True, context={'request': request})
    
    return Response({
        'results': serializer.data,
        'count': total_count,
        'page': page,
        'page_size': page_size,
        'total_pages': (total_count + page_size - 1) // page_size,
        'has_next': end < total_count,
        'has_previous': page > 1,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_recipes(request):
    """Get current user's recipes"""
    user = request.user
    recipes = Recipe.objects.select_related('author').filter(author=user).order_by('-created_at')
    
    # Apply pagination
    page = request.GET.get('page', 1)
    page_size = request.GET.get('page_size', 12)
    
    serializer = RecipeSerializer(recipes, many=True)
    return Response({
        'results': serializer.data,
        'count': recipes.count(),
    })
