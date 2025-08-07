from django.urls import path
from . import views

urlpatterns = [
    path('', views.RecipeListCreateView.as_view(), name='recipe-list-create'),
    path('<int:pk>/', views.RecipeDetailView.as_view(), name='recipe-detail'),
    path('<int:pk>/rate/', views.rate_recipe, name='rate-recipe'),
    path('search/', views.search_recipes, name='search-recipes'),
]