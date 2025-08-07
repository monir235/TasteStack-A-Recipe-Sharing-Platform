from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('user/', views.user_profile, name='user_profile'),
    path('user/update/', views.update_profile, name='update_profile'),
]