from email.policy import default
from django.db import models
from django.contrib.auth.models import User

# Create your models here.

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
    users = models.ManyToManyField(User, null=True)
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(importancy__gte=1) & models.Q(importancy__lt=10),
                name="A importancy value is valid between 1 and 10",
            )
        ]
    def __str__(self):
        return self.name
