// Глобальные переменные
let allTickets = [];
let selectedDate = null;
let selectedTickets = {};

// Загрузка типов билетов
async function loadTickets() {
    try {
        const response = await fetch('/api/tickets/');
        allTickets = await response.json();
        displayTickets();
        setupDateSelection();
    } catch (error) {
        console.error('Ошибка при загрузке билетов:', error);
    }
}

// Отображение типов билетов
function displayTickets() {
    const container = document.querySelector('.ticket-types');
    container.innerHTML = '';

    allTickets.forEach(ticket => {
        const card = createTicketCard(ticket);
        container.appendChild(card);
    });
}

// Создание карточки билета
function createTicketCard(ticket) {
    const card = document.createElement('div');
    card.className = 'ticket-type-card';
    card.innerHTML = `
        <h3>${ticket.name}</h3>
        <div class="price">${ticket.price} ₽</div>
        <p class="description">${ticket.description}</p>
        <div class="quantity-selector">
            <button class="decrease">-</button>
            <input type="number" min="0" value="0" data-ticket-id="${ticket.id}">
            <button class="increase">+</button>
        </div>
    `;

    // Обработчики для кнопок + и -
    const decreaseBtn = card.querySelector('.decrease');
    const increaseBtn = card.querySelector('.increase');
    const input = card.querySelector('input');

    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(input.value);
        if (currentValue > 0) {
            input.value = currentValue - 1;
            updateTicketQuantity(ticket.id, currentValue - 1);
        }
    });

    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(input.value);
        input.value = currentValue + 1;
        updateTicketQuantity(ticket.id, currentValue + 1);
    });

    input.addEventListener('change', (e) => {
        const value = parseInt(e.target.value);
        if (value < 0) e.target.value = 0;
        updateTicketQuantity(ticket.id, value);
    });

    return card;
}

// Настройка выбора даты
function setupDateSelection() {
    const dateInput = document.querySelector('#visitDate');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Установка минимальной даты (завтра)
    dateInput.min = tomorrow.toISOString().split('T')[0];

    // Установка максимальной даты (через 30 дней)
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);
    dateInput.max = maxDate.toISOString().split('T')[0];

    dateInput.addEventListener('change', (e) => {
        selectedDate = e.target.value;
        updateTicketSummary();
    });
}

// Обновление количества билетов
function updateTicketQuantity(ticketId, quantity) {
    selectedTickets[ticketId] = quantity;
    updateTicketSummary();
}

// Обновление сводки заказа
function updateTicketSummary() {
    const summaryContainer = document.querySelector('.ticket-summary-items');
    const totalElement = document.querySelector('.total-price');
    let total = 0;

    summaryContainer.innerHTML = '';

    Object.entries(selectedTickets).forEach(([ticketId, quantity]) => {
        if (quantity > 0) {
            const ticket = allTickets.find(t => t.id === parseInt(ticketId));
            const itemTotal = ticket.price * quantity;
            total += itemTotal;

            const item = document.createElement('div');
            item.className = 'ticket-summary-item';
            item.innerHTML = `
                <span>${ticket.name} x ${quantity}</span>
                <span>${itemTotal} ₽</span>
            `;
            summaryContainer.appendChild(item);
        }
    });

    totalElement.textContent = `Итого: ${total} ₽`;

    // Активация/деактивация кнопки покупки
    const purchaseBtn = document.querySelector('.purchase-btn');
    purchaseBtn.disabled = total === 0 || !selectedDate;
}

// Покупка билетов
async function purchaseTickets() {
    if (!selectedDate) {
        alert('Пожалуйста, выберите дату посещения');
        return;
    }

    const tickets = Object.entries(selectedTickets)
        .filter(([_, quantity]) => quantity > 0)
        .map(([ticketId, quantity]) => ({
            ticket_id: parseInt(ticketId),
            quantity: quantity
        }));

    if (tickets.length === 0) {
        alert('Пожалуйста, выберите хотя бы один билет');
        return;
    }

    try {
        const response = await fetch('/api/purchases/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                visit_date: selectedDate,
                tickets: tickets
            })
        });

        if (response.ok) {
            const result = await response.json();
            showPurchaseDetails(result);
        } else {
            throw new Error('Ошибка при покупке билетов');
        }
    } catch (error) {
        console.error('Ошибка при покупке билетов:', error);
        alert('Произошла ошибка при покупке билетов. Пожалуйста, попробуйте позже.');
    }
}

// Показ деталей покупки
function showPurchaseDetails(purchase) {
    const modal = document.getElementById('purchaseModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <h2>Билеты успешно приобретены!</h2>
        <p>Номер заказа: ${purchase.id}</p>
        <p>Дата посещения: ${purchase.visit_date}</p>
        <div class="purchase-details">
            ${purchase.tickets.map(ticket => `
                <div class="ticket-detail">
                    <p>${ticket.name} x ${ticket.quantity}</p>
                    <p>${ticket.price * ticket.quantity} ₽</p>
                </div>
            `).join('')}
        </div>
        <p class="total">Итого: ${purchase.total_price} ₽</p>
    `;

    modal.style.display = 'block';

    // Очистка формы после успешной покупки
    selectedTickets = {};
    selectedDate = null;
    document.querySelector('#visitDate').value = '';
    displayTickets();
    updateTicketSummary();
}

// Закрытие модального окна
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('purchaseModal').style.display = 'none';
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', (e) => {
    const modal = document.getElementById('purchaseModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadTickets();
    document.querySelector('.purchase-btn').addEventListener('click', purchaseTickets);
}); 