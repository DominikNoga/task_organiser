# Generated by Django 4.0.5 on 2022-10-17 12:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task_organiser', '0014_alter_appuser_profile_pic'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appuser',
            name='profile_pic',
            field=models.ImageField(blank=True, default='/blank_user.jpg', null=True, upload_to=''),
        ),
    ]
