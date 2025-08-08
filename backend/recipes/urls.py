from django.urls import path
from .views.main import RecipeListCreateView, RecipeDetailView, rate_recipe, search_recipes, my_recipes
from .views.stats import platform_statistics

urlpatterns = [
    path('', RecipeListCreateView.as_view(), name='recipe-list-create'),
    path('<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('<int:pk>/rate/', rate_recipe, name='rate-recipe'),
    path('search/', search_recipes, name='search-recipes'),
    path('my-recipes/', my_recipes, name='my-recipes'),
    path('statistics/', platform_statistics, name='platform-statistics'),
]
