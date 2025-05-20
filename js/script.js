document.addEventListener('DOMContentLoaded', function() {
    // Загрузка всех товаров
    loadProducts();
    
    // Инициализация корзины
    initCart();
    
    // Обработчики событий
    setupEventListeners();
    
    // Функциональность кнопки "наверх"
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Показать/скрыть кнопку в зависимости от прокрутки
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Прокрутка к верху при клике
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Загрузка товаров на страницу
function loadProducts() {
    // Вместо общего контейнера новинок, теперь у нас есть фильтрованные товары
    const saleContainer = document.querySelector('#sale .product-grid');
    
    // Отображение товаров со скидкой (isSale: true)
    const saleProducts = products.filter(product => product.isSale);
    
    if (saleContainer) {
        displayProducts(saleProducts, saleContainer);
    }
}

// Отображение товаров в указанном контейнере
function displayProducts(products, container) {
    if (!container) return;
    
    let html = '';
    
    products.forEach(product => {
        html += `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="product-overlay">
                        <button class="quick-view" data-id="${product.id}"><i class="fas fa-eye"></i></button>
                        <button class="add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-bag"></i></button>
                        <button class="add-to-favorite" data-id="${product.id}"><i class="far fa-heart"></i></button>
                    </div>
                </div>
                ${product.discount ? `<span class="discount-label">-${product.discount}%</span>` : ''}
                <div class="product-details">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">
                        <span class="current-price">${product.price} ₽</span>
                        ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ₽</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Инициализация корзины
function initCart() {
    // Проверяем, есть ли сохраненная корзина в localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Обновляем отображение количества товаров в корзине
    updateCartCount(cart);
}

// Обновление счетчика товаров в корзине
function updateCartCount(cart) {
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Обновление содержимого корзины
function updateCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    
    if (!cartItemsContainer || !cartTotalAmount) return;
    
    // Получаем корзину из localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        cartTotalAmount.textContent = '0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        
        if (product) {
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            
            html += `
                <div class="cart-item" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.title}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${product.title}</h4>
                        <p class="cart-item-price">${product.price} ₽</p>
                        <div class="cart-item-quantity">
                            <button class="decrease-quantity" data-id="${product.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity" data-id="${product.id}">+</button>
                        </div>
                        <button class="cart-item-remove" data-id="${product.id}">Удалить</button>
                    </div>
                </div>
            `;
        }
    });
    
    cartItemsContainer.innerHTML = html;
    cartTotalAmount.textContent = total;
}

// Добавление товара в корзину
function addToCart(productId) {
    // Получаем корзину из localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // Если товар уже в корзине, увеличиваем количество
        cart[existingItemIndex].quantity += 1;
    } else {
        // Если товара нет в корзине, добавляем его
        cart.push({
            id: productId,
            quantity: 1
        });
    }
    
    // Сохраняем корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновляем счетчик и содержимое корзины
    updateCartCount(cart);
    updateCartItems();
}

// Удаление товара из корзины
function removeFromCart(productId) {
    // Получаем корзину из localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Удаляем товар из корзины
    cart = cart.filter(item => item.id !== productId);
    
    // Сохраняем корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновляем счетчик и содержимое корзины
    updateCartCount(cart);
    updateCartItems();
}

// Изменение количества товара в корзине
function updateItemQuantity(productId, change) {
    // Получаем корзину из localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Находим индекс товара в корзине
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        // Изменяем количество товара
        cart[itemIndex].quantity += change;
        
        // Если количество стало 0 или меньше, удаляем товар из корзины
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        // Сохраняем корзину в localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Обновляем счетчик и содержимое корзины
        updateCartCount(cart);
        updateCartItems();
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Показать/скрыть корзину
    const cartIcon = document.querySelector('.cart');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.querySelector('.close-cart');
    
    if (cartIcon && cartModal && closeCart) {
        cartIcon.addEventListener('click', function() {
            cartModal.classList.add('active');
            updateCartItems();
        });
        
        closeCart.addEventListener('click', function() {
            cartModal.classList.remove('active');
        });
    }
    
    // Делегирование событий для товаров
    document.addEventListener('click', function(event) {
        // Добавление товара в корзину
        if (event.target.closest('.add-to-cart')) {
            const button = event.target.closest('.add-to-cart');
            const productId = parseInt(button.dataset.id);
            addToCart(productId);
        }
        
        // Удаление товара из корзины
        if (event.target.closest('.cart-item-remove')) {
            const button = event.target.closest('.cart-item-remove');
            const productId = parseInt(button.dataset.id);
            removeFromCart(productId);
        }
        
        // Увеличение количества товара в корзине
        if (event.target.closest('.increase-quantity')) {
            const button = event.target.closest('.increase-quantity');
            const productId = parseInt(button.dataset.id);
            updateItemQuantity(productId, 1);
        }
        
        // Уменьшение количества товара в корзине
        if (event.target.closest('.decrease-quantity')) {
            const button = event.target.closest('.decrease-quantity');
            const productId = parseInt(button.dataset.id);
            updateItemQuantity(productId, -1);
        }
    });
    
    // Форма подписки на рассылку
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput && emailInput.value) {
                // Имитация отправки данных
                alert(`Спасибо за подписку! На адрес ${emailInput.value} будут приходить наши новости.`);
                emailInput.value = '';
            }
        });
    }
    
    // Мобильное меню
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    if (mobileMenuToggle && mainNav && mobileMenuOverlay) {
        mobileMenuToggle.addEventListener('click', function() {
            toggleMobileMenu();
        });
        
        // Закрываем меню при клике на оверлей
        mobileMenuOverlay.addEventListener('click', function() {
            toggleMobileMenu(false);
        });
        
        // Закрываем меню при клике на ссылку
        const menuLinks = mainNav.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    toggleMobileMenu(false);
                }
            });
        });
        
        // Закрываем меню при изменении размера окна
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
                toggleMobileMenu(false);
            }
        });
        
        // Закрываем меню при изменении ориентации устройства
        window.addEventListener('orientationchange', function() {
            toggleMobileMenu(false);
        });
        
        // Закрываем меню при прокрутке страницы на мобильных устройствах
        window.addEventListener('scroll', function() {
            if (window.innerWidth <= 768 && mainNav.classList.contains('active')) {
                // Закрываем меню с небольшой задержкой при прокрутке
                if (this.scrollY > 50) {
                    toggleMobileMenu(false);
                }
            }
        });
        
        // Функция переключения мобильного меню
        function toggleMobileMenu(show) {
            if (show === undefined) {
                // Если не указан параметр, переключаем текущее состояние
                mainNav.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
                
                // Изменение иконки
                const icon = mobileMenuToggle.querySelector('i');
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                
                // Блокируем прокрутку страницы при открытом меню
                if (mainNav.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            } else if (show === false) {
                // Закрываем меню
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                
                const icon = mobileMenuToggle.querySelector('i');
                if (icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                
                // Разблокируем прокрутку
                document.body.style.overflow = '';
            }
        }
    }
} 