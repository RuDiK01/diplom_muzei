from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import User, Category, Location, Event, Author, TicketType, Ticket, Exhibit
from .serializers import (
    UserSerializer, CategorySerializer, LocationSerializer, EventSerializer,
    AuthorSerializer, TicketTypeSerializer, TicketSerializer, ExhibitSerializer
)
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        today = timezone.now().date()
        upcoming_events = Event.objects.filter(start_date__gte=today).order_by('start_date')
        serializer = self.get_serializer(upcoming_events, many=True)
        return Response(serializer.data)

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TicketTypeViewSet(viewsets.ModelViewSet):
    queryset = TicketType.objects.all()
    serializer_class = TicketTypeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return Ticket.objects.all()
        return Ticket.objects.filter(user=user)

class ExhibitViewSet(viewsets.ModelViewSet):
    queryset = Exhibit.objects.all()
    serializer_class = ExhibitSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_exhibits = Exhibit.objects.all().order_by('-date_add')[:6]
        serializer = self.get_serializer(featured_exhibits, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response(
                {"error": "category_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        exhibits = Exhibit.objects.filter(category_id=category_id)
        serializer = self.get_serializer(exhibits, many=True)
        return Response(serializer.data)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                return Response({'error': f'Поле {field} обязательно'}, status=400)
        if data.get('password') != data.get('password2'):
            return Response({'error': 'Пароли не совпадают'}, status=400)
        if User.objects.filter(username=data['username']).exists():
            return Response({'error': 'Пользователь с таким именем уже существует'}, status=400)
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            middle_name=data.get('middle_name', '')
        )
        return Response({'success': True})

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'success': True})
        return Response({'error': 'Неверные имя пользователя или пароль'}, status=400)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'success': True})

class CheckAuthView(APIView):
    def get(self, request):
        return Response({'isAuthenticated': request.user.is_authenticated})
