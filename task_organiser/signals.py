from .models import AppUser
from django.contrib.auth.models import User, Group
from django.db.models.signals import post_save


def create_app_user(sender, instance, created, **kwargs):
    if created:
        username = instance.username
        AppUser.objects.create(user=instance ,username=username)


post_save.connect(create_app_user, sender=User)
