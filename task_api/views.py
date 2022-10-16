from urllib import response
from task_organiser.models import *
from django.contrib.auth.models import User
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
# Create your views here.


@api_view(['GET'])
def home_api(request):
    api_urls = {
		'List':'/task_list/',
		'Detail View':'/task_detail/<str:pk>/',
        'User list': '/user_list/',
        'App user list': '/app_user_list',
        'messages list':'/messages_list/',
		}
    return Response(api_urls)


@api_view(['GET'])
def task_list(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def task_detail(request, pk):
    task = Task.objects.get(id=pk)
    serializer = TaskSerializer(task, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
def task_delete(request, pk):
    task = Task.objects.get(id=pk)
    task.delete()
    return Response()


@api_view(['GET'])
def users_list(request):
    users = User.objects.all()
    users_ser = UserSerializer(users, many=True)
    return Response(users_ser.data)


@api_view(['GET'])
def app_user_list(request):
    app_users = AppUser.objects.all()
    app_ser = AppUserSerializer(app_users, many=True)
    return Response(app_ser.data)


@api_view(['POST'])
def update_app_user(request, pk):
    app_user = AppUser.objects.get(user=pk)
    serializer = TaskSerializer(instance=app_user, 
        data=request.data)
    
    if serializer.is_valid():
        serializer.save()
    
    return Response(serializer.data)


@api_view(['GET'])
def messages_list(request):
    tasks = Message.objects.all()
    serializer = MessageSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def send_message(request):
    serializer = MessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    
    return Response(serializer.data)