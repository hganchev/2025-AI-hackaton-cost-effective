from django.apps import AppConfig


class AccountConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.account'

    def ready(self) -> None:
        import backend.account.signals
