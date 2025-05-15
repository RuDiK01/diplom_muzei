#!/bin/bash

# Создаем виртуальное окружение, если его нет
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Активируем виртуальное окружение
source venv/bin/activate

# Устанавливаем зависимости
pip install -r requirements.txt

# Применяем миграции
cd backend
python manage.py makemigrations
python manage.py migrate

# Создаем суперпользователя, если его нет
python manage.py createsuperuser --noinput --username admin --email admin@example.com

# Запускаем сервер
python manage.py runserver 