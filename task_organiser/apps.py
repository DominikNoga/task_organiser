from django.apps import AppConfig


class TaskOrganiserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'task_organiser'
    def ready(self):
        import task_organiser.signals
