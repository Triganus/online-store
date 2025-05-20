document.addEventListener('DOMContentLoaded', function() {
    // Инициализация обработчиков событий для оформления заказа
    initCheckoutEvents();
});

// Инициализация обработчиков событий
function initCheckoutEvents() {
    // Кнопка оформления заказа в корзине
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckout = document.querySelector('.close-checkout');
    
    if (checkoutBtn && checkoutModal && closeCheckout) {
        // Открыть модальное окно оформления заказа
        checkoutBtn.addEventListener('click', function() {
            // Проверяем, есть ли товары в корзине
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (cart.length === 0) {
                alert('Ваша корзина пуста. Добавьте товары для оформления заказа.');
                return;
            }
            
            // Закрываем модальное окно корзины
            document.getElementById('cartModal').classList.remove('active');
            
            // Открываем модальное окно оформления заказа
            checkoutModal.classList.add('active');
            
            // Заполняем информацию о заказе
            updateCheckoutSummary();
        });
        
        // Закрыть модальное окно оформления заказа
        closeCheckout.addEventListener('click', function() {
            checkoutModal.classList.remove('active');
        });
        
        // Закрыть модальное окно при клике вне его содержимого
        checkoutModal.addEventListener('click', function(event) {
            if (event.target === checkoutModal) {
                checkoutModal.classList.remove('active');
            }
        });
    }
    
    // Форма оформления заказа
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        // Обработчик выбора способа доставки
        const deliveryMethod = document.getElementById('delivery-method');
        
        if (deliveryMethod) {
            deliveryMethod.addEventListener('change', function() {
                updateDeliveryCost();
                updateCheckoutSummary();
            });
        }
        
        // Обработчик отправки формы
        checkoutForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Валидация формы
            if (!validateCheckoutForm()) {
                return;
            }
            
            // Подготовка данных заказа
            const orderData = prepareOrderData();
            
            // Сохранение заказа (в реальном проекте здесь был бы AJAX запрос на сервер)
            saveOrder(orderData);
            
            // Отображение подтверждения заказа
            showOrderConfirmation(orderData);
            
            // Очистка корзины
            clearCart();
        });
    }
    
    // Обработчики для модального окна подтверждения заказа
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    const closeConfirmation = document.querySelector('.close-confirmation');
    const continueShoppingBtn = document.querySelector('.continue-shopping-btn');
    
    if (orderConfirmationModal && closeConfirmation && continueShoppingBtn) {
        // Закрыть модальное окно подтверждения
        closeConfirmation.addEventListener('click', function() {
            orderConfirmationModal.classList.remove('active');
        });
        
        // Продолжить покупки
        continueShoppingBtn.addEventListener('click', function() {
            orderConfirmationModal.classList.remove('active');
            window.location.href = 'index.html';
        });
        
        // Закрыть модальное окно при клике вне его содержимого
        orderConfirmationModal.addEventListener('click', function(event) {
            if (event.target === orderConfirmationModal) {
                orderConfirmationModal.classList.remove('active');
            }
        });
    }
}

// Обновление стоимости доставки
function updateDeliveryCost() {
    const deliveryMethod = document.getElementById('delivery-method');
    const deliveryCost = document.getElementById('checkout-delivery');
    
    if (!deliveryMethod || !deliveryCost) return;
    
    let cost = 0;
    
    switch (deliveryMethod.value) {
        case 'courier':
            cost = 290;
            break;
        case 'pickup':
            cost = 0;
            break;
        case 'post':
            cost = 350;
            break;
        default:
            cost = 0;
    }
    
    deliveryCost.textContent = cost + ' ₽';
    
    return cost;
}

// Обновление информации о заказе
function updateCheckoutSummary() {
    const subtotalElement = document.getElementById('checkout-subtotal');
    const totalElement = document.getElementById('checkout-total');
    
    if (!subtotalElement || !totalElement) return;
    
    // Получаем корзину из localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Рассчитываем сумму заказа
    let subtotal = 0;
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        
        if (product) {
            subtotal += product.price * item.quantity;
        }
    });
    
    // Получаем стоимость доставки
    const deliveryCost = updateDeliveryCost() || 0;
    
    // Общая сумма
    const total = subtotal + deliveryCost;
    
    // Обновляем элементы на странице
    subtotalElement.textContent = subtotal + ' ₽';
    totalElement.textContent = total + ' ₽';
}

// Валидация формы оформления заказа
function validateCheckoutForm() {
    const customerName = document.getElementById('customer-name');
    const customerEmail = document.getElementById('customer-email');
    const customerPhone = document.getElementById('customer-phone');
    const deliveryMethod = document.getElementById('delivery-method');
    const customerCity = document.getElementById('customer-city');
    const customerAddress = document.getElementById('customer-address');
    const termsAgreement = document.getElementById('terms-agreement');
    
    // Проверяем заполнение обязательных полей
    if (!customerName.value.trim()) {
        alert('Пожалуйста, введите ваше имя и фамилию');
        customerName.focus();
        return false;
    }
    
    if (!customerEmail.value.trim()) {
        alert('Пожалуйста, введите ваш email');
        customerEmail.focus();
        return false;
    }
    
    // Простая проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail.value.trim())) {
        alert('Пожалуйста, введите корректный email');
        customerEmail.focus();
        return false;
    }
    
    if (!customerPhone.value.trim()) {
        alert('Пожалуйста, введите ваш телефон');
        customerPhone.focus();
        return false;
    }
    
    if (!deliveryMethod.value) {
        alert('Пожалуйста, выберите способ доставки');
        deliveryMethod.focus();
        return false;
    }
    
    if (!customerCity.value.trim()) {
        alert('Пожалуйста, введите город доставки');
        customerCity.focus();
        return false;
    }
    
    if (deliveryMethod.value !== 'pickup' && !customerAddress.value.trim()) {
        alert('Пожалуйста, введите адрес доставки');
        customerAddress.focus();
        return false;
    }
    
    if (!termsAgreement.checked) {
        alert('Необходимо согласиться с условиями публичной оферты и политикой конфиденциальности');
        termsAgreement.focus();
        return false;
    }
    
    return true;
}

// Подготовка данных заказа
function prepareOrderData() {
    const customerName = document.getElementById('customer-name').value.trim();
    const customerEmail = document.getElementById('customer-email').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();
    const deliveryMethod = document.getElementById('delivery-method').value;
    const customerCity = document.getElementById('customer-city').value.trim();
    const customerAddress = document.getElementById('customer-address').value.trim();
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Получаем корзину из localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Рассчитываем стоимость заказа
    let subtotal = 0;
    let items = [];
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        
        if (product) {
            subtotal += product.price * item.quantity;
            
            items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                quantity: item.quantity,
                total: product.price * item.quantity
            });
        }
    });
    
    // Стоимость доставки
    const deliveryCost = updateDeliveryCost() || 0;
    
    // Общая сумма
    const total = subtotal + deliveryCost;
    
    // Генерация номера заказа
    const orderNumber = generateOrderNumber();
    
    return {
        orderNumber: orderNumber,
        date: new Date().toISOString(),
        customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            city: customerCity,
            address: customerAddress
        },
        delivery: {
            method: deliveryMethod,
            cost: deliveryCost
        },
        payment: {
            method: paymentMethod
        },
        items: items,
        subtotal: subtotal,
        deliveryCost: deliveryCost,
        total: total
    };
}

// Генерация номера заказа
function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `${year}${month}${day}-${random}`;
}

// Сохранение заказа
function saveOrder(orderData) {
    // В реальном проекте здесь был бы AJAX запрос на сервер
    // Для демонстрации сохраняем в localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Отображение подтверждения заказа
function showOrderConfirmation(orderData) {
    const checkoutModal = document.getElementById('checkoutModal');
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    const orderNumberElement = document.getElementById('order-number');
    
    // Закрываем модальное окно оформления заказа
    if (checkoutModal) {
        checkoutModal.classList.remove('active');
    }
    
    // Отображаем номер заказа
    if (orderNumberElement) {
        orderNumberElement.textContent = orderData.orderNumber;
    }
    
    // Открываем модальное окно подтверждения заказа
    if (orderConfirmationModal) {
        orderConfirmationModal.classList.add('active');
    }
}

// Очистка корзины
function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Обновляем счетчик товаров в корзине
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        cartCount.textContent = '0';
    }
} 