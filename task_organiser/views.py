from django.shortcuts import render, redirect
from .forms import *
from .models import *
from django.contrib.auth import authenticate, login, logout
from datetime import date
from django.core import serializers


def home(request):
    taskForm = addTaskForm()
    if request.method == "POST":
        form = addTaskForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("home_redirect")
    current_user = request.user
    tasks = current_user.task_set.filter(deadline__contains=date.today()).order_by("deadline")
    context = {"user": current_user, "tasks": tasks, "form":taskForm}
    return render(request, "task_organiser/home.html", context)


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


def register_page(request):
    form = CreateUserForm()
    if request.method == "POST":
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')

    context = {"form": form, }
    return render(request, "task_organiser/register.html", context)


def messages(request):
    context = {}
    return render(request, "task_organiser/messages.html", context)
