# Музейный проект

## Требования
- Python 3.x
- pip (менеджер пакетов Python)
- Node.js и npm (для frontend части)

## Установка и запуск

### Вариант 1: Автоматический запуск (рекомендуется)

1. Откройте терминал в корневой директории проекта
2. Сделайте скрипт запуска исполняемым:
   ```bash
   chmod +x run.sh
   ```
3. Запустите скрипт:
   ```bash
   ./run.sh
   ```

Скрипт автоматически:
- Создаст виртуальное окружение Python
- Установит все необходимые зависимости
- Применит миграции базы данных
- Создаст суперпользователя (логин: admin, пароль: admin)
- Запустит сервер разработки

### Вариант 2: Ручная установка

#### Backend

1. Создайте виртуальное окружение:
   ```bash
   python3 -m venv venv
   ```

2. Активируйте виртуальное окружение:
   - На Linux/Mac:
     ```bash
     source venv/bin/activate
     ```
   - На Windows:
     ```bash
     venv\Scripts\activate
     ```

3. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```

4. Перейдите в директорию backend:
   ```bash
   cd backend
   ```

5. Примените миграции:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Создайте суперпользователя:
   ```bash
   python manage.py createsuperuser
   ```

7. Запустите сервер разработки:
   ```bash
   python manage.py runserver
   ```

#### Frontend

1. Перейдите в директорию frontend:
   ```bash
   cd frontend
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Запустите приложение:
   ```bash
   npm start
   ```

## Доступ к приложению

- Backend API будет доступен по адресу: http://localhost:8000
- Frontend приложение будет доступно по адресу: http://localhost:3000
- Админ-панель Django: http://localhost:8000/admin
  - Логин: admin
  - Пароль: admin

## Примечания

- Убедитесь, что порты 8000 и 3000 свободны перед запуском
- Для остановки сервера используйте Ctrl+C в терминале
- При возникновении проблем с зависимостями попробуйте обновить pip:
  ```bash
  pip install --upgrade pip
  ``` 