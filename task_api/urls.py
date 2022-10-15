from . import views
from django.urls import path

urlpatterns = [
    path('', views.home_api, name='home_api'),
    path('task_list/', views.task_list, name='task_list'),
    path('task_detail/<str:pk>', views.task_detail, name='task_detail'),
    path('task_delete/<str:pk>', views.task_delete, name='task_delete'),
    path('users_list/', views.users_list, name='users_list'),
]
