from . import views
from django.urls import path

urlpatterns = [
    path('', views.home_api, name='home_api'),
    path('task_list/', views.task_list, name='task_list'),
    path('app_users_list/', views.app_user_list, name='app_users_list'),
    path('task_detail/<str:pk>', views.task_detail, name='task_detail'),
    path('app_user_detail/<str:pk>', views.app_user_detail, name='app_user_detail'),
    path('update_app_user/<str:pk>', views.update_app_user, name='update_app_user'),
    path('update_message/<str:pk>', views.update_message, name='update_message'),
    path('task_delete/<str:pk>', views.task_delete, name='task_delete'),
    path('users_list/', views.users_list, name='users_list'),
    path("messages_list/", views.messages_list, name='messages_list'),
    path('send_message/', views.send_message, name='send_message'),
]
