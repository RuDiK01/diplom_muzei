// Функция для проверки авторизации
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/check/', {
            credentials: 'include'
        });
        const data = await response.json();
        updateAuthUI(data.isAuthenticated);
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

// Функция для обновления UI в зависимости от статуса авторизации
function updateAuthUI(isAuthenticated) {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;

    if (isAuthenticated) {
        authButtons.innerHTML = `
            <button onclick="logout()" class="auth-button">Выйти</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button onclick="window.location.href='/login'" class="auth-button">Войти</button>
            <button onclick="window.location.href='/register'" class="auth-button">Регистрация</button>
        `;
    }
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

// Функция для выхода
async function logout() {
    try {
        const csrftoken = getCookie('csrftoken');
        const response = await fetch('/api/auth/logout/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrftoken,
            }
        });
        if (response.ok) {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Функция для обработки формы входа
async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('/api/auth/login/', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
            window.location.href = '/';
        } else {
            alert(data.error || 'Ошибка входа');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Произошла ошибка при входе');
    }
}

// Функция для обработки формы регистрации
async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('/api/auth/register/', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
            window.location.href = '/';
        } else {
            alert(data.error || 'Ошибка регистрации');
        }
    } catch (error) {
        console.error('Error registering:', error);
        alert('Произошла ошибка при регистрации');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Добавляем обработчики для форм
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}); 