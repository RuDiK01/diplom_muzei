// Функция для обновления баланса в профиле
async function updateProfileBalance() {
    try {
        const resp = await fetch('/api/auth/check/', { credentials: 'include' });
        const data = await resp.json();
        if (data.isAuthenticated && data.user && typeof data.user.balance !== 'undefined') {
            document.getElementById('profileBalance').textContent = data.user.balance;
        }
    } catch (e) {}
}

// Функция для пополнения баланса через API
async function addBalance(amount) {
    try {
        // Получаем id пользователя
        const resp = await fetch('/api/auth/check/', { credentials: 'include' });
        const data = await resp.json();
        if (data.isAuthenticated && data.user) {
            const userId = data.user.id;
            // Делаем POST запрос на add_balance
            const patchResp = await fetch(`/api/users/${userId}/add_balance/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ amount: amount })
            });
            if (patchResp.ok) {
                await updateProfileBalance();
                alert('Баланс успешно пополнен!');
            } else {
                alert('Ошибка при пополнении баланса');
            }
        }
    } catch (e) {
        alert('Ошибка при пополнении баланса');
    }
}

// Загрузка информации о пользователе и активных событиях

document.addEventListener('DOMContentLoaded', async function () {
    // Получаем данные пользователя (пример: через /api/users/me/ или /api/auth/check/)
    // Здесь для примера используем только email и имя из /api/auth/check/
    let userInfo = {};
    try {
        const resp = await fetch('/api/auth/check/', { credentials: 'include' });
        const data = await resp.json();
        if (data.isAuthenticated && data.user) {
            userInfo = data.user;
        }
    } catch (e) {
        // fallback
    }

    // Получаем билеты пользователя
    let tickets = [];
    try {
        const resp = await fetch('/api/tickets/', { credentials: 'include' });
        if (resp.ok) {
            tickets = await resp.json();
        }
    } catch (e) {
        // fallback
    }

    // Формируем список событий из билетов
    const events = tickets.map(ticket => ({
        name: ticket.ticket_type_name,
        date: ticket.visit_date
    }));

    // Вставляем данные в профиль
    document.getElementById('profileName').textContent = userInfo.first_name ? userInfo.first_name : '—';
    document.getElementById('profileEmail').textContent = userInfo.email ? userInfo.email : '—';
    document.getElementById('profileDate').textContent = userInfo.date_registration ? userInfo.date_registration : '—';
    document.getElementById('profileBalance').textContent = userInfo.balance !== undefined ? userInfo.balance : '0';

    // Активные события
    const eventsList = document.getElementById('activeEventsList');
    eventsList.innerHTML = '';
    // Получаем зарегистрированные бесплатные события из localStorage
    let registeredEvents = [];
    try {
        registeredEvents = JSON.parse(localStorage.getItem('registeredEvents')) || [];
    } catch (e) {}
    const allEvents = [...events];
    registeredEvents.forEach(ev => {
        if (!allEvents.some(e => e.id === ev.id)) {
            allEvents.push(ev);
        }
    });
    if (allEvents.length === 0) {
        eventsList.innerHTML = '<li>Нет купленных событий</li>';
    } else {
        allEvents.forEach(ev => {
            const li = document.createElement('li');
            li.textContent = `${ev.name} — ${ev.date}`;
            eventsList.appendChild(li);
        });
    }

    // Пополнение баланса через API
    document.getElementById('addBalanceBtn').onclick = function () {
        alert('В разработке');
    };
});

// Экспорт функции для обновления баланса (для использования в других скриптах)
window.updateProfileBalance = updateProfileBalance; 