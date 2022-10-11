from django.forms import ModelForm, Textarea
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import *


class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']



class addTaskForm(ModelForm):
    class Meta:
        model = Task
        fields = "__all__"
        widgets = {
            "description": Textarea(attrs={"rows":1, "cols":20}),
        }
