import os
import django
from django.core.files import File

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'museum.settings')
django.setup()

from api.models import Event

def add_images_to_events():
    # Создаем директорию для изображений событий, если её нет
    os.makedirs('media/events', exist_ok=True)

    # Копируем изображения из корневой директории
    os.system('cp ../1.jpg media/events/lecture.jpg')
    os.system('cp ../2.jpg media/events/exhibition.jpg')
    os.system('cp ../4.jpg media/events/excursion.jpg')

    # Получаем события
    lecture = Event.objects.filter(event_type='Лекция').first()
    exhibition = Event.objects.filter(event_type='Выставка').first()
    excursion = Event.objects.filter(event_type='Экскурсия').first()

    # Добавляем изображения к событиям
    if lecture:
        with open('media/events/lecture.jpg', 'rb') as f:
            lecture.image = File(f, name='lecture.jpg')
            lecture.save()
            print(f'Added image to event: {lecture.name}')

    if exhibition:
        with open('media/events/exhibition.jpg', 'rb') as f:
            exhibition.image = File(f, name='exhibition.jpg')
            exhibition.save()
            print(f'Added image to event: {exhibition.name}')

    if excursion:
        with open('media/events/excursion.jpg', 'rb') as f:
            excursion.image = File(f, name='excursion.jpg')
            excursion.save()
            print(f'Added image to event: {excursion.name}')

if __name__ == '__main__':
    add_images_to_events() 