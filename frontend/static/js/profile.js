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
    // Баланс — если появится на бэке, можно подгружать, пока оставим 0
    document.getElementById('profileBalance').textContent = '0';

    // Активные события
    const eventsList = document.getElementById('activeEventsList');
    eventsList.innerHTML = '';
    if (events.length === 0) {
        eventsList.innerHTML = '<li>Нет купленных событий</li>';
    } else {
        events.forEach(ev => {
            const li = document.createElement('li');
            li.textContent = `${ev.name} — ${ev.date}`;
            eventsList.appendChild(li);
        });
    }

    // Пополнение баланса (имитация)
    document.getElementById('addBalanceBtn').onclick = function () {
        const input = document.getElementById('addBalanceInput');
        const value = parseInt(input.value);
        if (!isNaN(value) && value > 0) {
            // Здесь должен быть реальный запрос на пополнение баланса
            let current = parseInt(document.getElementById('profileBalance').textContent) || 0;
            current += value;
            document.getElementById('profileBalance').textContent = current;
            input.value = '';
            alert('Баланс успешно пополнен!');
        } else {
            alert('Введите корректную сумму');
        }
    };
}); 