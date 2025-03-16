from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone

from backend.account.manager import BaseUserAppManager


class BaseAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        unique=True,
        null=False,
        blank=False,
    )

    is_staff = models.BooleanField(
        default=False,
        null=False,
        blank=False,
    )

    is_active = models.BooleanField(
        default=True,
        null=False,
        blank=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    EMAIL_FIELD = 'email'

    objects = BaseUserAppManager()

    class Meta:
        db_table = 'base_account'
        indexes = (
            models.Index(fields=('email',)),
        )

    def __str__(self):
        return self.email


class Profile(models.Model):
    FIST_NAME_MAX_LENGTH = 50
    LAST_NAME_MAX_LENGTH = 50

    fist_name = models.CharField(
        max_length=FIST_NAME_MAX_LENGTH,
        null=False,
        blank=False,
    )

    last_name = models.CharField(
        max_length=LAST_NAME_MAX_LENGTH,
        null=False,
        blank=False,
    )

    account = models.ForeignKey(
        to=BaseAccount,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )

    class Meta:
        db_table = 'profile'
        verbose_name = 'profile'


class AccountVerification(models.Model):
    VERIFICATION_MAX_LENGTH = 6

    account = models.OneToOneField(
        to=BaseAccount,
        primary_key=True,
        on_delete=models.CASCADE,
        related_name='verification'
    )

    verification_code = models.CharField(
        max_length=VERIFICATION_MAX_LENGTH,
        unique=True,
        null=False,
        blank=False,
    )

    expiration_time = models.DateTimeField()

    class Meta:
        db_table = 'account_verification'

    def verify(self, code: str) -> bool:
        """Verify the account using the provided code."""
        if self.verification_code == code and self.expiration_time > timezone.now():
            self.account.is_active = True
            self.account.save(update_fields=['is_active'])
            return True
        return False

    def is_expired(self) -> bool:
        """Check if the verification code has expired."""
        return self.expiration_time <= timezone.now()
