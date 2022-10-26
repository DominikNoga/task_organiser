from dataclasses import fields
from pyexpat import model
from task_organiser.models import *
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.fields import empty


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class AppUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = "__all__"


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"


class UpdateAppUserSerializer(serializers.ModelSerializer):
    friends = AppUserSerializer(many=True, read_only=True)
    class Meta:
        model = AppUser
        fields = ["friends"]
