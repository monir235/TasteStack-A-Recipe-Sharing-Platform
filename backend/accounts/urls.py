from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('user/', views.user_profile, name='user_profile'),
    path('user/update/', views.update_profile, name='update_profile'),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
    path('recent-activity/', views.recent_activity, name='recent_activity'),
    path('profile/<int:user_id>/', views.public_profile, name='public_profile'),
    path('follow/<int:user_id>/', views.follow_user, name='follow_user'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('reset-password/', views.reset_password, name='reset_password'),
]
