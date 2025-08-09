from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    # Custom username validator that allows spaces and more characters
    flexible_username_validator = RegexValidator(
        regex=r'^[\w\s.@+-]+$',
        message=_('Enter a valid username. This value may contain letters, numbers, spaces, and @/./+/-/_ characters.'),
        code='invalid_username'
    )
    
    # Override the username field to use our custom validator
    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        help_text=_('Required. 150 characters or fewer. Letters, digits, spaces and @/./+/-/_ only.'),
        validators=[flexible_username_validator],
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )
    
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=200, blank=True)
    website = models.URLField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
