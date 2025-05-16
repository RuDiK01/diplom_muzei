from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import EmailValidator, RegexValidator

class User(AbstractUser):
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    role = models.CharField(
        max_length=20,
        choices=[('Admin', 'Admin'), ('User', 'User')],
        default='User'
    )
    date_registration = models.DateField(auto_now_add=True)
    
    # Добавляем related_name для решения конфликта
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='museum_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='museum_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    class Meta:
        db_table = 'Users'

class Category(models.Model):
    category_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image_url = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.category_name

class Location(models.Model):
    name_location = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'Location'

    def __str__(self):
        return self.name_location

class Event(models.Model):
    EVENT_TYPES = [
        ('Лекция', 'Лекция'),
        ('Экскурсия', 'Экскурсия'),
        ('Выставка', 'Выставка'),
    ]

    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    image = models.CharField(max_length=100, blank=True, null=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)

    class Meta:
        db_table = 'Event'

    def __str__(self):
        return self.name

class Author(models.Model):
    last_name = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    biography = models.CharField(max_length=255, blank=True, null=True)
    image = models.CharField(max_length=100, blank=True, null=True)
    web_page_url = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'Author'

    def __str__(self):
        return f"{self.last_name} {self.first_name}"

class TicketType(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'TicketType'

    def __str__(self):
        return self.name

class Ticket(models.Model):
    ticket_type = models.ForeignKey(TicketType, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_purchase = models.DateTimeField(auto_now_add=True)
    visit_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_used = models.BooleanField(default=False)

    class Meta:
        db_table = 'Ticket'

    def __str__(self):
        return f"Билет {self.id} - {self.ticket_type.name}"

class Exhibit(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    image = models.CharField(max_length=100, blank=True, null=True)
    date_add = models.DateField(auto_now_add=True)
    scientific_name = models.CharField(max_length=255, blank=True, null=True)
    era = models.CharField(max_length=100, blank=True, null=True)
    discovery_location = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'Exhibit'

    def __str__(self):
        return self.name
