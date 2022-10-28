from contextlib import nullcontext
from email.policy import default
from tkinter import CASCADE
from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class AppUser(models.Model):
    profile_pic = models.ImageField(null=True,
        default="/blank_user.jpg", blank=True)
    username = models.CharField(max_length=100, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE,
        primary_key=True)
    friends = models.ManyToManyField("self", blank=True)
    
    def __str__(self):
        return self.username


class Message(models.Model):
    type_choices = [("reg", "regular"), 
        ("fr","friend_request"), 
        ("gr","group_request")
    ]
    sender = models.ForeignKey(User, on_delete=models.CASCADE,
        related_name="sender")
    reciever = models.ForeignKey(User, on_delete=models.CASCADE,
        related_name="reciever")
    content = models.CharField(max_length=1000, null=True)
    date_sent = models.DateTimeField(auto_now_add=True, null=True)
    type = models.CharField(max_length=20, null=True, 
        choices=type_choices)
    
    def __str__(self):
        return f"{self.sender} to {self.reciever} on: {self.date_sent} "


class FriendsGroup(models.Model):
    members = models.ManyToManyField(AppUser)
    group_name = models.CharField(max_length=40, null=True)
    
    def __str__(self):
        return self.group_name



class Task(models.Model):
    status_choices = [
        ("to do", "to do"),
        ("in progress", "in progress"),
    ]
    name = models.CharField(max_length=100, null=True)
    description = models.CharField(max_length=1000, null=True, blank=True, default=" ")
    status = models.CharField(max_length=20, null=True, choices=status_choices)
    deadline = models.DateTimeField(null=True)
    date_added = models.DateTimeField(null=True, auto_now_add=True)
    importancy = models.IntegerField(null=True, default=1)
    users = models.ManyToManyField(User)
    group = models.ForeignKey(FriendsGroup, on_delete=models.CASCADE, blank=True, null=True)
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(importancy__gte=1) & models.Q(importancy__lt=10),
                name="A importancy value is valid between 1 and 10",
            )
        ]
    def __str__(self):
        return self.name
