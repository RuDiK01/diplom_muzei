// Глобальные переменные
let allExhibits = [];
let currentFilters = {
    categories: [],
    eras: []
};

// Загрузка экспонатов
async function loadExhibits() {
    try {
        const response = await fetch('/api/exhibits/');
        allExhibits = await response.json();
        displayExhibits(allExhibits);
        setupFilters();
    } catch (error) {
        console.error('Ошибка при загрузке экспонатов:', error);
    }
}

// Отображение экспонатов
function displayExhibits(exhibits) {
    const container = document.getElementById('exhibitsGrid');
    container.innerHTML = '';

    if (exhibits.length === 0) {
        container.innerHTML = '<div class="no-exhibits">Нет экспонатов для отображения.</div>';
        return;
    }

    exhibits.forEach(exhibit => {
        const card = createExhibitCard(exhibit);
        container.appendChild(card);
    });
}

// Создание карточки экспоната
function createExhibitCard(exhibit) {
    const card = document.createElement('div');
    card.className = 'exhibit-card';
    card.innerHTML = `
        <img src="${exhibit.image || '/static/images/default-exhibit.jpg'}" alt="${exhibit.name}">
        <div class="exhibit-card-content">
            <h3>${exhibit.name}</h3>
            <p>${exhibit.description ? exhibit.description.substring(0, 100) + '...' : ''}</p>
            <p class="era">Эпоха: ${exhibit.era || 'Не указана'}</p>
            <button onclick="showExhibitDetails(${exhibit.id})">Подробнее</button>
        </div>
    `;
    return card;
}

// Настройка фильтров
function setupFilters() {
    // Получение уникальных категорий и эпох
    const categories = [...new Set(allExhibits.map(exhibit => exhibit.category_name))];
    const eras = [...new Set(allExhibits.map(exhibit => exhibit.era).filter(Boolean))];

    // Создание фильтров категорий
    const categoryFilters = document.getElementById('categoryFilters');
    categories.forEach(category => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" value="${category}" onchange="updateFilters()">
            ${category}
        `;
        categoryFilters.appendChild(label);
    });

    // Создание фильтров эпох
    const eraFilters = document.getElementById('eraFilters');
    eras.forEach(era => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" value="${era}" onchange="updateFilters()">
            ${era}
        `;
        eraFilters.appendChild(label);
    });
}

// Обновление фильтров
function updateFilters() {
    // Получение выбранных категорий
    const selectedCategories = Array.from(document.querySelectorAll('#categoryFilters input:checked'))
        .map(input => input.value);

    // Получение выбранных эпох
    const selectedEras = Array.from(document.querySelectorAll('#eraFilters input:checked'))
        .map(input => input.value);

    // Фильтрация экспонатов
    let filteredExhibits = allExhibits;

    if (selectedCategories.length > 0) {
        filteredExhibits = filteredExhibits.filter(exhibit => 
            selectedCategories.includes(exhibit.category_name)
        );
    }

    if (selectedEras.length > 0) {
        filteredExhibits = filteredExhibits.filter(exhibit => 
            selectedEras.includes(exhibit.era)
        );
    }

    // Применение поиска
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filteredExhibits = filteredExhibits.filter(exhibit =>
            exhibit.name.toLowerCase().includes(searchTerm) ||
            exhibit.description.toLowerCase().includes(searchTerm)
        );
    }

    displayExhibits(filteredExhibits);
}

// Показ деталей экспоната
async function showExhibitDetails(exhibitId) {
    try {
        const response = await fetch(`/api/exhibits/${exhibitId}/`);
        const exhibit = await response.json();
        
        const modal = document.getElementById('exhibitModal');
        const details = document.getElementById('exhibitDetails');
        
        details.innerHTML = `
            <h2>${exhibit.name}</h2>
            <img src="${exhibit.image || '/static/images/default-exhibit.jpg'}" alt="${exhibit.name}">
            <div class="exhibit-info">
                <p><strong>Категория:</strong> ${exhibit.category_name}</p>
                <p><strong>Эпоха:</strong> ${exhibit.era || 'Не указана'}</p>
                <p><strong>Место обнаружения:</strong> ${exhibit.discovery_location || 'Не указано'}</p>
                <p><strong>Научное название:</strong> ${exhibit.scientific_name || 'Не указано'}</p>
                <p><strong>Автор:</strong> ${exhibit.author_name}</p>
                <p><strong>Описание:</strong></p>
                <p>${exhibit.description || 'Описание отсутствует'}</p>
            </div>
        `;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Ошибка при загрузке деталей экспоната:', error);
    }
}

// Закрытие модального окна
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('exhibitModal').style.display = 'none';
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', (event) => {
    const modal = document.getElementById('exhibitModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Поиск
document.getElementById('searchInput').addEventListener('input', updateFilters);

// Загрузка экспонатов при загрузке страницы
document.addEventListener('DOMContentLoaded', loadExhibits); 