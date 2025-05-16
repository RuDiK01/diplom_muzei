// admin_panel.js

// --- Навигация ---
document.addEventListener('DOMContentLoaded', () => {
    showAdminHome();
    document.getElementById('categoriesNav').addEventListener('click', (e) => {
        e.preventDefault();
        loadCategories();
    });
    document.getElementById('exhibitsNav').addEventListener('click', (e) => {
        e.preventDefault();
        loadExhibits();
    });
    document.getElementById('eventsNav').addEventListener('click', (e) => {
        e.preventDefault();
        loadEventsAdmin();
    });
    // Добавляю пункт меню для пользователей, если его нет
    if (!document.getElementById('usersNav')) {
        const nav = document.querySelector('.nav-links');
        const usersLink = document.createElement('a');
        usersLink.href = '#';
        usersLink.id = 'usersNav';
        usersLink.textContent = 'Пользователи';
        nav.appendChild(usersLink);
        usersLink.addEventListener('click', (e) => {
            e.preventDefault();
            loadUsersAdmin();
        });
    }
});

function showAdminHome() {
    document.getElementById('adminContent').innerHTML = `
        <div style="text-align:center; margin-top:2rem;">
            <h2>Добро пожаловать в админ-панель музея!</h2>
            <p>Выберите раздел для управления данными музея.</p>
        </div>
    `;
}

// --- Категории ---
async function loadCategories() {
    const container = document.getElementById('adminContent');
    container.innerHTML = '<h2 class="admin-section-title">Категории экспонатов</h2>';
    // Форма добавления
    container.innerHTML += `
        <form class="admin-form" id="addCategoryForm">
            <label>Название категории</label>
            <input type="text" name="category_name" required>
            <label>Описание</label>
            <textarea name="description"></textarea>
            <button type="submit" class="admin-btn">Добавить категорию</button>
        </form>
        <div id="categoriesTableWrap"></div>
    `;
    document.getElementById('addCategoryForm').onsubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = {
            category_name: form.category_name.value,
            description: form.description.value
        };
        const csrftoken = getCookie('csrftoken');
        const resp = await fetch('/api/categories/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        if (resp.ok) {
            loadCategories();
        } else {
            alert('Ошибка при добавлении категории');
        }
    };
    renderCategoriesTable();
}

async function renderCategoriesTable() {
    const wrap = document.getElementById('categoriesTableWrap');
    wrap.innerHTML = '<p>Загрузка...</p>';
    const resp = await fetch('/api/categories/', { credentials: 'include' });
    const cats = await resp.json();
    let html = `<table class="admin-table"><tr><th>ID</th><th>Название</th><th>Описание</th><th></th></tr>`;
    for (const cat of cats) {
        html += `<tr>
            <td>${cat.id}</td>
            <td><input type="text" value="${cat.category_name}" data-id="${cat.id}" class="cat-name-input"></td>
            <td><input type="text" value="${cat.description || ''}" data-id="${cat.id}" class="cat-desc-input"></td>
            <td>
                <button class="admin-btn" onclick="deleteCategory(${cat.id})">Удалить</button>
                <button class="admin-btn" onclick="saveCategory(${cat.id})">Сохранить</button>
            </td>
        </tr>`;
    }
    html += '</table>';
    wrap.innerHTML = html;
}

window.deleteCategory = async function(id) {
    if (!confirm('Удалить категорию?')) return;
    const csrftoken = getCookie('csrftoken');
    const resp = await fetch(`/api/categories/${id}/`, {
        method: 'DELETE',
        headers: { 'X-CSRFToken': csrftoken },
        credentials: 'include',
    });
    if (resp.ok) {
        renderCategoriesTable();
    } else {
        alert('Ошибка при удалении');
    }
}

window.saveCategory = async function(id) {
    const name = document.querySelector(`.cat-name-input[data-id='${id}']`).value;
    const desc = document.querySelector(`.cat-desc-input[data-id='${id}']`).value;
    const csrftoken = getCookie('csrftoken');
    const resp = await fetch(`/api/categories/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
        body: JSON.stringify({ category_name: name, description: desc })
    });
    if (resp.ok) {
        renderCategoriesTable();
    } else {
        alert('Ошибка при сохранении');
    }
}

// --- Экспонаты ---
async function loadExhibits() {
    const container = document.getElementById('adminContent');
    container.innerHTML = '<h2 class="admin-section-title">Экспонаты</h2>';
    container.innerHTML += `
        <form class="admin-form" id="addExhibitForm">
            <label>Название</label>
            <input type="text" name="name" required>
            <label>Категория</label>
            <select name="category" id="exhibitCategorySelect"></select>
            <label>Локация</label>
            <select name="location" id="exhibitLocationSelect"></select>
            <label>Автор</label>
            <select name="author" id="exhibitAuthorSelect"></select>
            <label>Описание</label>
            <textarea name="description"></textarea>
            <label>Научное название</label>
            <input type="text" name="scientific_name">
            <label>Эра</label>
            <input type="text" name="era">
            <label>Место находки</label>
            <input type="text" name="discovery_location">
            <label>Изображение</label>
            <input type="file" name="image">
            <button type="submit" class="admin-btn">Добавить экспонат</button>
        </form>
        <div id="exhibitsTableWrap"></div>
    `;
    await fillExhibitSelects();
    document.getElementById('addExhibitForm').onsubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const csrftoken = getCookie('csrftoken');
        const resp = await fetch('/api/exhibits/', {
            method: 'POST',
            headers: { 'X-CSRFToken': csrftoken },
            credentials: 'include',
            body: formData
        });
        if (resp.ok) {
            loadExhibits();
        } else {
            alert('Ошибка при добавлении экспоната');
        }
    };
    renderExhibitsTable();
}

async function fillExhibitSelects() {
    // Категории
    const catResp = await fetch('/api/categories/', { credentials: 'include' });
    const cats = await catResp.json();
    const catSel = document.getElementById('exhibitCategorySelect');
    catSel.innerHTML = cats.map(c => `<option value="${c.id}">${c.category_name}</option>`).join('');
    // Локации
    const locResp = await fetch('/api/locations/', { credentials: 'include' });
    const locs = await locResp.json();
    const locSel = document.getElementById('exhibitLocationSelect');
    locSel.innerHTML = locs.map(l => `<option value="${l.id}">${l.name_location}</option>`).join('');
    // Авторы
    const authResp = await fetch('/api/authors/', { credentials: 'include' });
    const auths = await authResp.json();
    const authSel = document.getElementById('exhibitAuthorSelect');
    authSel.innerHTML = auths.map(a => `<option value="${a.id}">${a.last_name} ${a.first_name}</option>`).join('');
}

async function renderExhibitsTable() {
    const wrap = document.getElementById('exhibitsTableWrap');
    wrap.innerHTML = '<p>Загрузка...</p>';
    const resp = await fetch('/api/exhibits/', { credentials: 'include' });
    const exhibits = await resp.json();
    let html = `<table class="admin-table"><tr><th>ID</th><th>Название</th><th>Категория</th><th>Локация</th><th>Автор</th><th>Эра</th><th></th></tr>`;
    for (const ex of exhibits) {
        html += `<tr>
            <td>${ex.id}</td>
            <td><input type="text" value="${ex.name}" data-id="${ex.id}" class="ex-name-input"></td>
            <td>${ex.category_name}</td>
            <td>${ex.location_name}</td>
            <td>${ex.author_name}</td>
            <td><input type="text" value="${ex.era || ''}" data-id="${ex.id}" class="ex-era-input"></td>
            <td>
                <button class="admin-btn" onclick="deleteExhibit(${ex.id})">Удалить</button>
                <button class="admin-btn" onclick="saveExhibit(${ex.id})">Сохранить</button>
            </td>
        </tr>`;
    }
    html += '</table>';
    wrap.innerHTML = html;
}

window.deleteExhibit = async function(id) {
    if (!confirm('Удалить экспонат?')) return;
    const csrftoken = getCookie('csrftoken');
    const resp = await fetch(`/api/exhibits/${id}/`, {
        method: 'DELETE',
        headers: { 'X-CSRFToken': csrftoken },
        credentials: 'include',
    });
    if (resp.ok) {
        renderExhibitsTable();
    } else {
        alert('Ошибка при удалении');
    }
}

window.saveExhibit = async function(id) {
    const name = document.querySelector(`.ex-name-input[data-id='${id}']`).value;
    const era = document.querySelector(`.ex-era-input[data-id='${id}']`).value;
    const csrftoken = getCookie('csrftoken');
    const resp = await fetch(`/api/exhibits/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
        body: JSON.stringify({ name, era })
    });
    if (resp.ok) {
        renderExhibitsTable();
    } else {
        alert('Ошибка при сохранении');
    }
}

// --- События ---
async function loadEventsAdmin() {
    const container = document.getElementById('adminContent');
    container.innerHTML = '<h2 class="admin-section-title">События</h2>';
    container.innerHTML += `
        <form class="admin-form" id="addEventForm">
            <label>Название</label>
            <input type="text" name="name" required>
            <label>Тип события</label>
            <select name="event_type" id="eventTypeSelect">
                <option value="Лекция">Лекция</option>
                <option value="Экскурсия">Экскурсия</option>
                <option value="Выставка">Выставка</option>
            </select>
            <label>Локация</label>
            <select name="location" id="eventLocationSelect"></select>
            <label>Описание</label>
            <textarea name="description"></textarea>
            <label>Дата начала</label>
            <input type="date" name="start_date" required>
            <label>Дата окончания</label>
            <input type="date" name="end_date" required>
            <label>Изображение</label>
            <input type="file" name="image">
            <button type="submit" class="admin-btn">Добавить событие</button>
        </form>
        <div id="eventsTableWrap"></div>
    `;
    await fillEventSelects();
    document.getElementById('addEventForm').onsubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const csrftoken = getCookie('csrftoken');
        const resp = await fetch('/api/events/', {
            method: 'POST',
            headers: { 'X-CSRFToken': csrftoken },
            credentials: 'include',
            body: formData
        });
        if (resp.ok) {
            loadEventsAdmin();
        } else {
            alert('Ошибка при добавлении события');
        }
    };
    renderEventsTable();
}

async function fillEventSelects() {
    // Локации
    const locResp = await fetch('/api/locations/', { credentials: 'include' });
    const locs = await locResp.json();
    const locSel = document.getElementById('eventLocationSelect');
    locSel.innerHTML = locs.map(l => `<option value="${l.id}">${l.name_location}</option>`).join('');
}

async function renderEventsTable() {
    const wrap = document.getElementById('eventsTableWrap');
    wrap.innerHTML = '<p>Загрузка...</p>';
    const resp = await fetch('/api/events/', { credentials: 'include' });
    const events = await resp.json();
    let html = `<table class="admin-table"><tr><th>ID</th><th>Название</th><th>Тип</th><th>Локация</th><th>Дата</th><th></th></tr>`;
    for (const ev of events) {
        html += `<tr>
            <td>${ev.id}</td>
            <td><input type="text" value="${ev.name}" data-id="${ev.id}" class="ev-name-input"></td>
            <td>${ev.event_type}</td>
            <td>${ev.location_name}</td>
            <td>${ev.start_date} - ${ev.end_date}</td>
            <td>
                <button class="admin-btn" onclick="deleteEvent(${ev.id})">Удалить</button>
                <button class="admin-btn" onclick="saveEvent(${ev.id})">Сохранить</button>
            </td>
        </tr>`;
    }
    html += '</table>';
    wrap.innerHTML = html;
}

window.deleteEvent = async function(id) {
    if (!confirm('Удалить событие?')) return;
    const csrftoken = getCookie('csrftoken');
    const resp = await fetch(`/api/events/${id}/`, {
        method: 'DELETE',
        headers: { 'X-CSRFToken': csrftoken },
        credentials: 'include',
    });
    if (resp.ok) {
        renderEventsTable();
    } else {
        alert('Ошибка при удалении');
    }
}

window.saveEvent = async function(id) {
    const name = document.querySelector(`.ev-name-input[data-id='${id}']`).value;
    const csrftoken = getCookie('csrftoken');
    const resp = await fetch(`/api/events/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
        body: JSON.stringify({ name })
    });
    if (resp.ok) {
        renderEventsTable();
    } else {
        alert('Ошибка при сохранении');
    }
}

// --- Пользователи ---
async function loadUsersAdmin() {
    const container = document.getElementById('adminContent');
    container.innerHTML = '<h2 class="admin-section-title">Пользователи</h2>';
    container.innerHTML += '<div id="usersTableWrap"></div>';
    renderUsersTable();
}

async function renderUsersTable() {
    const wrap = document.getElementById('usersTableWrap');
    wrap.innerHTML = '<p>Загрузка...</p>';
    const resp = await fetch('/api/users/', { credentials: 'include' });
    const users = await resp.json();
    let html = `<table class="admin-table"><tr><th>ID</th><th>Логин</th><th>Имя</th><th>Фамилия</th><th>Роль</th><th>Действие</th></tr>`;
    for (const user of users) {
        html += `<tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>
                <select data-id="${user.id}" class="user-role-select">
                    <option value="User" ${user.role === 'User' ? 'selected' : ''}>User</option>
                    <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
                </select>
            </td>
            <td><button class="admin-btn" onclick="saveUserRole(${user.id})">Сохранить</button></td>
        </tr>`;
    }
    html += '</table>';
    wrap.innerHTML = html;
}

window.saveUserRole = async function(id) {
    const role = document.querySelector(`.user-role-select[data-id='${id}']`).value;
    const csrftoken = getCookie('csrftoken');
    const resp = await fetch(`/api/users/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
        body: JSON.stringify({ role })
    });
    if (resp.ok) {
        renderUsersTable();
    } else {
        alert('Ошибка при изменении роли');
    }
} 