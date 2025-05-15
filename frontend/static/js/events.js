// Глобальные переменные
let allEvents = [];
let currentEventType = 'all';

// Загрузка событий
async function loadEvents() {
    try {
        const response = await fetch('/api/events/upcoming/');
        allEvents = await response.json();
        displayEvents(allEvents);
    } catch (error) {
        console.error('Ошибка при загрузке событий:', error);
    }
}

// Отображение событий
function displayEvents(events) {
    const container = document.getElementById('eventsContainer');
    container.innerHTML = '';

    events.forEach(event => {
        const card = createEventCard(event);
        container.appendChild(card);
    });
}

// Создание карточки события
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
        <img src="${event.image || '/static/images/default-event.jpg'}" alt="${event.name}">
        <div class="event-card-content">
            <span class="event-type">${event.event_type}</span>
            <h3>${event.name}</h3>
            <p class="event-date">${formatDate(event.start_date)} - ${formatDate(event.end_date)}</p>
            <p class="event-location">Место: ${event.location_name}</p>
            <p>${event.description ? event.description.substring(0, 100) + '...' : ''}</p>
            <button onclick="showEventDetails(${event.id})">Подробнее</button>
        </div>
    `;
    return card;
}

// Форматирование даты
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Фильтрация событий по типу
function filterEventsByType(type) {
    currentEventType = type;
    
    // Обновление активной кнопки
    document.querySelectorAll('.event-type-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        }
    });

    // Фильтрация событий
    const filteredEvents = type === 'all' 
        ? allEvents 
        : allEvents.filter(event => event.event_type === type);
    
    displayEvents(filteredEvents);
}

// Показ деталей события
async function showEventDetails(eventId) {
    try {
        const response = await fetch(`/api/events/${eventId}/`);
        const event = await response.json();
        
        const modal = document.getElementById('eventModal');
        const details = document.getElementById('eventDetails');
        
        details.innerHTML = `
            <div class="event-details">
                <img src="${event.image || '/static/images/default-event.jpg'}" alt="${event.name}">
                <div class="event-info">
                    <h2>${event.name}</h2>
                    <span class="event-type">${event.event_type}</span>
                    <p class="event-date">Дата: ${formatDate(event.start_date)} - ${formatDate(event.end_date)}</p>
                    <p class="event-location">Место: ${event.location_name}</p>
                    <p>${event.description || 'Описание отсутствует'}</p>
                    <button class="register-btn">Зарегистрироваться</button>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Ошибка при загрузке деталей события:', error);
    }
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    loadEvents();

    // Обработчики для кнопок фильтрации
    document.querySelectorAll('.event-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterEventsByType(btn.dataset.type);
        });
    });

    // Закрытие модального окна
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('eventModal').style.display = 'none';
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('eventModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}); 