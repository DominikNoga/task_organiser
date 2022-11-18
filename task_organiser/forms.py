from django import forms
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


class ChangeProfilePicForm(ModelForm):
    profile_pic = forms.FileField(label='', label_suffix='', help_text='')
    class Meta:
        model = AppUser
        fields =['profile_pic']
