"""
URL configuration for museum project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', TemplateView.as_view(template_name='index.html')),
    path('exhibits/', TemplateView.as_view(template_name='exhibits.html')),
    path('events/', TemplateView.as_view(template_name='events.html')),
    path('tickets/', TemplateView.as_view(template_name='tickets.html')),
    path('about/', TemplateView.as_view(template_name='about.html')),
    path('login/', TemplateView.as_view(template_name='login.html')),
    path('register/', TemplateView.as_view(template_name='register.html')),
    path('admin-panel/', TemplateView.as_view(template_name='admin_panel.html')),
    path('profile/', TemplateView.as_view(template_name='profile.html')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
