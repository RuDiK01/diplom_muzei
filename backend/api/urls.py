from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

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
    path('', include(router.urls)),
] 