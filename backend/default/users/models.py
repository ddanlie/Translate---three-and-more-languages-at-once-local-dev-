from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import PermissionsMixin

# temporary no auth, no user solution
class User(AbstractUser, PermissionsMixin):
    class Meta:
        db_table = "users"
