from django.contrib import admin
from .models import *
# Register your models here.


admin.site.register(Task)
admin.site.register(AppUser)
admin.site.register(FriendsGroup)
admin.site.register(Message)
admin.site.register(GroupMessage)