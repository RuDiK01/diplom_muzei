import os
import django
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'museum.settings')
django.setup()

from api.models import Event, Location

def create_events():
    # Создаем локации, если их нет
    locations = {
        'main_hall': Location.objects.get_or_create(
            name_location='Главный зал',
            description='Основной выставочный зал музея'
        )[0],
        'lecture_hall': Location.objects.get_or_create(
            name_location='Лекционный зал',
            description='Зал для проведения лекций и семинаров'
        )[0],
        'exhibition_hall': Location.objects.get_or_create(
            name_location='Выставочный зал',
            description='Специальный зал для временных выставок'
        )[0]
    }

    # Список событий
    events = [
        {
            'name': 'Лекция "Древние цивилизации"',
            'description': 'Увлекательная лекция о древних цивилизациях и их вкладе в развитие человечества',
            'start_date': datetime.now().date() + timedelta(days=2),
            'end_date': datetime.now().date() + timedelta(days=2),
            'location': locations['lecture_hall'],
            'event_type': 'Лекция'
        },
        {
            'name': 'Выставка "Сокровища древнего мира"',
            'description': 'Уникальная выставка артефактов древних цивилизаций',
            'start_date': datetime.now().date() + timedelta(days=5),
            'end_date': datetime.now().date() + timedelta(days=30),
            'location': locations['exhibition_hall'],
            'event_type': 'Выставка'
        },
        {
            'name': 'Экскурсия "Тайны музея"',
            'description': 'Специальная экскурсия по закрытым фондам музея',
            'start_date': datetime.now().date() + timedelta(days=3),
            'end_date': datetime.now().date() + timedelta(days=3),
            'location': locations['main_hall'],
            'event_type': 'Экскурсия'
        },
        {
            'name': 'Лекция "Искусство эпохи Возрождения"',
            'description': 'Лекция о великих художниках и их произведениях эпохи Возрождения',
            'start_date': datetime.now().date() + timedelta(days=7),
            'end_date': datetime.now().date() + timedelta(days=7),
            'location': locations['lecture_hall'],
            'event_type': 'Лекция'
        },
        {
            'name': 'Выставка "Современное искусство"',
            'description': 'Выставка работ современных художников',
            'start_date': datetime.now().date() + timedelta(days=10),
            'end_date': datetime.now().date() + timedelta(days=40),
            'location': locations['exhibition_hall'],
            'event_type': 'Выставка'
        },
        {
            'name': 'Экскурсия "Ночной музей"',
            'description': 'Специальная ночная экскурсия по музею',
            'start_date': datetime.now().date() + timedelta(days=14),
            'end_date': datetime.now().date() + timedelta(days=14),
            'location': locations['main_hall'],
            'event_type': 'Экскурсия'
        },
        {
            'name': 'Лекция "Археологические открытия"',
            'description': 'Лекция о последних археологических открытиях',
            'start_date': datetime.now().date() + timedelta(days=15),
            'end_date': datetime.now().date() + timedelta(days=15),
            'location': locations['lecture_hall'],
            'event_type': 'Лекция'
        },
        {
            'name': 'Выставка "Древний Египет"',
            'description': 'Выставка артефактов Древнего Египта',
            'start_date': datetime.now().date() + timedelta(days=20),
            'end_date': datetime.now().date() + timedelta(days=60),
            'location': locations['exhibition_hall'],
            'event_type': 'Выставка'
        }
    ]

    # Создаем события
    for event_data in events:
        event, created = Event.objects.get_or_create(
            name=event_data['name'],
            defaults=event_data
        )
        if created:
            print(f'Created event: {event.name}')
        else:
            print(f'Event already exists: {event.name}')

if __name__ == '__main__':
    create_events() 