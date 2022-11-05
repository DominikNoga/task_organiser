from django.shortcuts import render, redirect
from .forms import *
from .models import *
from django.contrib.auth import authenticate, login, logout
from datetime import date
from django.contrib.auth.decorators import login_required


@login_required(login_url='login')
def home(request):
    taskForm = addTaskForm()
    importancy = 1
    if request.method == "POST":
        form = addTaskForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("home_redirect")
    current_user = request.user
    tasks = current_user.task_set.filter(deadline__contains=date.today()).order_by("deadline")
    def return_class(x):
        if x < 3:
            return "low"
        elif x > 6:
            return "high"
        
        else:
            return "medium" 
    
    classes = [return_class(task.importancy) for task in tasks]    
    tasks_classes = [[tasks[i], classes[i]] for i in range(len(tasks))]
    messages = Message.objects.filter(reciever=current_user).order_by('-date_sent')
    context = {"user": current_user, "form":taskForm, "importancy": importancy,
        "tasks": tasks_classes, "messages": messages, 
    }
    return render(request, "task_organiser/home.html", context)


@login_required(login_url='login')
def calendar(request):
    current_user = request.user
    tasks = current_user.task_set.all().order_by("deadline")
    context = {"tasks": tasks}
    return render(request, "task_organiser/calendar.html", context)


def home_redirect(request):
    return redirect("home")


def login_page(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate( request, username=username, password=password )
        if user is not None:
            login(request, user)
            return redirect('home')
    context = {}
    return render(request, "task_organiser/login.html", context)


def logout_page(request):
    logout(request)
    return redirect('login')


def register_page(request):
    form = CreateUserForm()
    if request.method == "POST":
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')

    context = {"form": form, }
    return render(request, "task_organiser/register.html", context)


@login_required(login_url='login')
def messages(request):
    current_user = request.user
    user_profile_pic = current_user.appuser.profile_pic
    context = {"profile_pic": user_profile_pic, 
    "current_user": current_user}
    return render(request, "task_organiser/messages.html", context)


@login_required(login_url='login')
def edit_task(request, task_id):
    task = Task.objects.get(id=task_id)
    importancy = task.importancy
    form = addTaskForm(instance=task)
    if request.method == 'POST':
        form = addTaskForm(request.POST ,instance=task)
        form.save()
        return redirect("calendar")

    context = {'task': task, "form": form, "importancy": importancy}
    return render(request, 'task_organiser/editTask.html', context)


@login_required(login_url='login')
def user_profile(request):
    return render(request, 'task_organiser/userProfile.html')