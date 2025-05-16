from django.contrib import admin
from .models import Event, Location, Exhibit, TicketType, User
from django.utils.html import format_html

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("name", "event_type", "start_date", "end_date", "location", "image_preview")
    list_filter = ("event_type", "start_date", "location")
    search_fields = ("name", "description")
    readonly_fields = ("image_preview",)
    
    fieldsets = (
        (None, {
            "fields": ("name", "event_type", "description", "start_date", "end_date", "location", "ticket_type", "image", "image_preview")
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 150px; max-width: 200px;" />', obj.image.url)
        return "(Нет изображения)"
    image_preview.short_description = "Превью изображения"

@admin.register(Exhibit)
class ExhibitAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "location", "author", "era", "image_preview")
    list_filter = ("category", "location", "era")
    search_fields = ("name", "description", "scientific_name", "era", "discovery_location")
    readonly_fields = ("image_preview", "date_add")
    
    fieldsets = (
        (None, {
            "fields": ("name", "category", "location", "author", "description", "image", "image_preview", "scientific_name", "era", "discovery_location")
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 150px; max-width: 200px;" />', obj.image.url)
        return "(Нет изображения)"
    image_preview.short_description = "Превью изображения"

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "first_name", "last_name", "balance", "role", "is_staff")
    search_fields = ("username", "email", "first_name", "last_name")
    list_filter = ("role", "is_staff")
    fieldsets = (
        (None, {"fields": ("username", "password", "email", "first_name", "last_name", "middle_name", "role", "balance", "is_staff", "is_active")}),
    )

# Можно зарегистрировать другие модели, если нужно
admin.site.register(Location)
admin.site.register(TicketType)
