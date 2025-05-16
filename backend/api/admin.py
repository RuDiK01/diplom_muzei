from django.contrib import admin
from .models import Event, Location
from django.utils.html import format_html

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("name", "event_type", "start_date", "end_date", "location", "image_preview")
    list_filter = ("event_type", "start_date", "location")
    search_fields = ("name", "description")
    readonly_fields = ("image_preview",)
    
    fieldsets = (
        (None, {
            "fields": ("name", "event_type", "description", "start_date", "end_date", "location", "image", "image_preview")
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 150px; max-width: 200px;" />', obj.image.url)
        return "(Нет изображения)"
    image_preview.short_description = "Превью изображения"

# Можно зарегистрировать другие модели, если нужно
admin.site.register(Location)
