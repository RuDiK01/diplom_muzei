from rest_framework import serializers
from .models import User, Category, Location, Event, Author, TicketType, Ticket, Exhibit, EventRegistration

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'middle_name', 'role', 'date_registration']
        read_only_fields = ['date_registration']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source='location.name_location', read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'start_date', 'end_date', 'image', 
                 'location', 'location_name', 'event_type']

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    ticket_type_name = serializers.CharField(source='ticket_type.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'ticket_type', 'ticket_type_name', 'user', 'user_name',
                 'date_purchase', 'visit_date', 'price', 'is_used']

class ExhibitSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name', read_only=True)
    location_name = serializers.CharField(source='location.name_location', read_only=True)
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Exhibit
        fields = ['id', 'category', 'category_name', 'location', 'location_name',
                 'author', 'author_name', 'name', 'description', 'image',
                 'date_add', 'scientific_name', 'era', 'discovery_location']

    def get_author_name(self, obj):
        return f"{obj.author.last_name} {obj.author.first_name}"

class EventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRegistration
        fields = ['id', 'user', 'event', 'registered_at'] 