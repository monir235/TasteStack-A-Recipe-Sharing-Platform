from django.urls import path
from . import views

urlpatterns = [
    path('recipes/<int:recipe_id>/like/', views.like_recipe, name='like-recipe'),
    path('recipes/<int:recipe_id>/unlike/', views.unlike_recipe, name='unlike-recipe'),
    path('recipes/<int:recipe_id>/comments/', views.get_recipe_comments, name='get-recipe-comments'),
    path('recipes/<int:recipe_id>/comments/add/', views.add_comment, name='add-comment'),
    path('recipes/<int:recipe_id>/comments/<int:comment_id>/edit/', views.edit_comment, name='edit-comment'),
    path('recipes/<int:recipe_id>/comments/<int:comment_id>/delete/', views.delete_comment, name='delete-comment'),
    path('recipes/<int:recipe_id>/comments/<int:comment_id>/hide/', views.hide_comment, name='hide-comment'),
]