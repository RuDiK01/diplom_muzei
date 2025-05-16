from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import EventRegisterView

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'locations', views.LocationViewSet)
router.register(r'events', views.EventViewSet)
router.register(r'authors', views.AuthorViewSet)
router.register(r'ticket-types', views.TicketTypeViewSet)
router.register(r'tickets', views.TicketViewSet)
router.register(r'exhibits', views.ExhibitViewSet)

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('auth/check/', views.CheckAuthView.as_view(), name='check_auth'),
    path('events/<int:pk>/register/', EventRegisterView.as_view(), name='event-register'),
    path('', include(router.urls)),
] 