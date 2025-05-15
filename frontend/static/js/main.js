// Функция для загрузки экспонатов
async function loadFeaturedExhibits() {
    try {
        const response = await fetch('/api/exhibits/featured/');
        const exhibits = await response.json();
        const exhibitsGrid = document.getElementById('featuredExhibits');
        
        exhibits.forEach(exhibit => {
            const exhibitCard = createExhibitCard(exhibit);
            exhibitsGrid.appendChild(exhibitCard);
        });
    } catch (error) {
        console.error('Ошибка при загрузке экспонатов:', error);
    }
}

// Функция для загрузки событий
async function loadUpcomingEvents() {
    try {
        const response = await fetch('/api/events/upcoming/');
        const events = await response.json();
        const eventsGrid = document.getElementById('upcomingEvents');
        
        events.forEach(event => {
            const eventCard = createEventCard(event);
            eventsGrid.appendChild(eventCard);
        });
    } catch (error) {
        console.error('Ошибка при загрузке событий:', error);
    }
}

// Создание карточки экспоната
function createExhibitCard(exhibit) {
    const card = document.createElement('div');
    card.className = 'exhibit-card';
    card.innerHTML = `
        <img src="${exhibit.image}" alt="${exhibit.name}">
        <h3>${exhibit.name}</h3>
        <p>${exhibit.description.substring(0, 100)}...</p>
        <button onclick="showExhibitDetails(${exhibit.id})">Подробнее</button>
    `;
    return card;
}

// Создание карточки события
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
        <img src="${event.image}" alt="${event.name}">
        <h3>${event.name}</h3>
        <p>${event.description.substring(0, 100)}...</p>
        <p class="event-date">${formatDate(event.startDate)}</p>
        <button onclick="showEventDetails(${event.id})">Подробнее</button>
    `;
    return card;
}

// Форматирование даты
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Обработчики для кнопок авторизации
document.getElementById('loginBtn').addEventListener('click', () => {
    // Здесь будет логика открытия модального окна входа
    console.log('Открыть окно входа');
});

document.getElementById('registerBtn').addEventListener('click', () => {
    // Здесь будет логика открытия модального окна регистрации
    console.log('Открыть окно регистрации');
});

// Загрузка данных при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedExhibits();
    loadUpcomingEvents();
}); 