// Глобальные переменные
let allEvents = [];
let currentEventType = 'all';

// Сопоставление data-type с русскими названиями типов событий
const eventTypeMap = {
    'lecture': 'Лекция',
    'excursion': 'Экскурсия',
    'exhibition': 'Выставка',
};

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
    let filteredEvents;
    if (type === 'all') {
        filteredEvents = allEvents;
    } else {
        const ruType = eventTypeMap[type];
        filteredEvents = allEvents.filter(event => event.event_type === ruType);
    }
    displayEvents(filteredEvents);
}

// Получение CSRF-токена из cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Показ деталей события
async function showEventDetails(eventId) {
    try {
        const response = await fetch(`/api/events/${eventId}/`);
        const event = await response.json();

        // Получаем баланс пользователя
        let balance = null;
        try {
            const authResp = await fetch('/api/auth/check/', { credentials: 'include' });
            const authData = await authResp.json();
            if (authData.isAuthenticated && authData.user && typeof authData.user.balance !== 'undefined') {
                balance = parseFloat(authData.user.balance);
            }
        } catch (e) {}

        // Получаем цену билета
        let ticketPrice = null;
        if (event.ticket_type && event.ticket_type.price !== undefined) {
            ticketPrice = parseFloat(event.ticket_type.price);
        }

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
                    <p><b>Цена билета:</b> ${ticketPrice !== null ? ticketPrice + ' ₽' : '—'}</p>
                    <p><b>Ваш баланс:</b> <span id="userBalance">${balance !== null ? balance + ' ₽' : '—'}</span></p>
                    <div id="eventRegisterMsg" style="color:red;margin-bottom:8px;"></div>
                    <button class="register-btn" data-event-id="${event.id}">Зарегистрироваться</button>
                    <button class="register-free-btn" data-event-id="${event.id}">Зарегистрироваться бесплатно</button>
                </div>
            </div>
        `;

        // Добавляем обработчик на кнопку регистрации
        const registerBtn = details.querySelector('.register-btn');
        if (registerBtn) {
            registerBtn.addEventListener('click', async () => {
                try {
                    const csrftoken = getCookie('csrftoken');
                    const regResponse = await fetch(`/api/events/${event.id}/register/`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken,
                        },
                    });
                    const regData = await regResponse.json();
                    const msgDiv = document.getElementById('eventRegisterMsg');
                    if (regResponse.status === 401) {
                        msgDiv.style.color = 'red';
                        msgDiv.textContent = 'Пожалуйста, войдите в аккаунт, чтобы зарегистрироваться на событие.';
                        return;
                    }
                    if (regResponse.ok) {
                        msgDiv.style.color = 'green';
                        msgDiv.textContent = regData.message || 'Вы успешно зарегистрированы на событие!';
                        // Обновляем баланс
                        if (typeof regData.balance !== 'undefined') {
                            document.getElementById('userBalance').textContent = regData.balance + ' ₽';
                            if (window.updateProfileBalance) window.updateProfileBalance();
                        }
                    } else {
                        msgDiv.style.color = 'red';
                        msgDiv.textContent = regData.error || 'Ошибка регистрации на событие';
                    }
                } catch (err) {
                    const msgDiv = document.getElementById('eventRegisterMsg');
                    msgDiv.style.color = 'red';
                    msgDiv.textContent = 'Ошибка при регистрации на событие';
                }
            });
        }

        // Добавляем обработчик на кнопку бесплатной регистрации
        const registerFreeBtn = details.querySelector('.register-free-btn');
        if (registerFreeBtn) {
            registerFreeBtn.addEventListener('click', function() {
                // Добавить событие в registeredEvents и localStorage
                window.registeredEvents = window.registeredEvents || [];
                const regEvent = {
                    id: event.id,
                    name: event.name,
                    date: formatDate(event.start_date)
                };
                // Проверка на дублирование по id события
                let stored = [];
                try {
                    stored = JSON.parse(localStorage.getItem('registeredEvents')) || [];
                } catch (e) {}
                if (!stored.some(e => e.id === regEvent.id)) {
                    stored.push(regEvent);
                    window.registeredEvents = stored;
                    localStorage.setItem('registeredEvents', JSON.stringify(stored));
                    alert('Вы зарегистрированы на событие!');
                } else {
                    alert('Вы уже зарегистрированы на это событие!');
                }
            });
        }

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