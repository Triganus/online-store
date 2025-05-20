document.addEventListener('DOMContentLoaded', function() {
    // Получаем id товара из URL (для примера будем использовать первый товар)
    const productId = getProductIdFromUrl() || 1;
    
    // Загружаем информацию о товаре
    loadProductInfo(productId);
    
    // Загружаем похожие товары
    loadRelatedProducts(productId);
    
    // Инициализируем галерею товара
    initProductGallery();
    
    // Обработчики событий для табов
    initTabs();
    
    // Обработчики для выбора цвета, размера и количества
    initProductOptions();
    
    // Кнопка добавления в корзину
    initAddToCartButton(productId);
});

// Получение id товара из URL (в реальном проекте здесь была бы полноценная логика)
function getProductIdFromUrl() {
    // Пример: product.html?id=3
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null;
}

// Загрузка информации о товаре
function loadProductInfo(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Обновляем основную информацию о товаре
    document.title = `${product.title} - MODA`;
    document.getElementById('product-title').textContent = product.title;
    document.getElementById('product-name').textContent = product.title;
    document.getElementById('product-price').textContent = `${product.price} ₽`;
    document.getElementById('product-description').textContent = product.description;
    
    // Если есть старая цена, отображаем ее
    if (product.oldPrice) {
        document.getElementById('product-old-price').textContent = `${product.oldPrice} ₽`;
    }
    
    // Обновляем основное изображение
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.title;
    }
    
    // Обновляем миниатюры
    const thumbnails = document.querySelectorAll('.thumbnail img');
    if (thumbnails.length > 0) {
        thumbnails[0].src = product.image;
    }
    
    // Обновляем цвета товара
    updateColorOptions(product.colors);
    
    // Обновляем размеры товара
    updateSizeOptions(product.sizes);
    
    // Обновляем хлебные крошки (breadcrumbs)
    updateBreadcrumbs(product.category);
}

// Обновление хлебных крошек
function updateBreadcrumbs(category) {
    const breadcrumbs = document.querySelector('.breadcrumbs');
    
    if (breadcrumbs) {
        const categoryLink = breadcrumbs.querySelector('a:nth-child(2)');
        
        if (categoryLink) {
            let categoryName = '';
            let categoryUrl = '';
            
            switch (category) {
                case 'women':
                    categoryName = 'Женщинам';
                    categoryUrl = 'index.html#women';
                    break;
                case 'men':
                    categoryName = 'Мужчинам';
                    categoryUrl = 'index.html#men';
                    break;
                case 'accessories':
                    categoryName = 'Аксессуары';
                    categoryUrl = 'index.html#accessories';
                    break;
                default:
                    categoryName = 'Категория';
                    categoryUrl = 'index.html';
            }
            
            categoryLink.textContent = categoryName;
            categoryLink.href = categoryUrl;
        }
    }
}

// Обновление опций цветов
function updateColorOptions(colors) {
    const colorOptionsContainer = document.querySelector('.color-options');
    
    if (!colorOptionsContainer || !colors || colors.length === 0) return;
    
    // Очищаем контейнер
    colorOptionsContainer.innerHTML = '';
    
    // Добавляем опции цветов
    colors.forEach((color, index) => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option' + (index === 0 ? ' active' : '');
        colorOption.setAttribute('data-color', color);
        
        // Устанавливаем цвет
        switch (color) {
            case 'white':
                colorOption.style.backgroundColor = 'white';
                break;
            case 'black':
                colorOption.style.backgroundColor = 'black';
                break;
            case 'beige':
                colorOption.style.backgroundColor = 'beige';
                break;
            case 'blue':
                colorOption.style.backgroundColor = 'blue';
                break;
            case 'grey':
                colorOption.style.backgroundColor = 'grey';
                break;
            case 'navy':
                colorOption.style.backgroundColor = 'navy';
                break;
            case 'olive':
                colorOption.style.backgroundColor = 'olive';
                break;
            case 'bordeaux':
                colorOption.style.backgroundColor = '#800020';
                break;
            case 'brown':
                colorOption.style.backgroundColor = 'brown';
                break;
            case 'gold':
                colorOption.style.backgroundColor = 'gold';
                break;
            case 'multi':
                // Для мультицветных товаров создаем градиент
                colorOption.style.background = 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)';
                break;
            default:
                colorOption.style.backgroundColor = color;
        }
        
        colorOptionsContainer.appendChild(colorOption);
    });
}

// Обновление опций размеров
function updateSizeOptions(sizes) {
    const sizeOptionsContainer = document.querySelector('.size-options');
    
    if (!sizeOptionsContainer || !sizes || sizes.length === 0) return;
    
    // Очищаем контейнер
    sizeOptionsContainer.innerHTML = '';
    
    // Добавляем опции размеров
    sizes.forEach((size, index) => {
        const sizeOption = document.createElement('div');
        sizeOption.className = 'size-option' + (index === 0 ? ' active' : '');
        sizeOption.setAttribute('data-size', size);
        sizeOption.textContent = size;
        
        sizeOptionsContainer.appendChild(sizeOption);
    });
}

// Загрузка похожих товаров
function loadRelatedProducts(productId) {
    const relatedContainer = document.querySelector('.related-products .product-grid');
    
    if (!relatedContainer) return;
    
    // Получаем текущий товар
    const currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) return;
    
    // Получаем товары той же категории, кроме текущего
    const relatedProducts = products.filter(p => p.category === currentProduct.category && p.id !== productId);
    
    // Выбираем не более 4 товаров для отображения
    const productsToShow = relatedProducts.slice(0, 4);
    
    // Отображаем товары
    displayProducts(productsToShow, relatedContainer);
}

// Инициализация галереи товара
function initProductGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    if (!thumbnails.length || !mainImage) return;
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Удаляем активный класс у всех миниатюр
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс текущей миниатюре
            this.classList.add('active');
            
            // Обновляем основное изображение
            const thumbnailImg = this.querySelector('img');
            mainImage.src = thumbnailImg.src;
        });
    });
}

// Инициализация табов
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabButtons.length || !tabContents.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок и контента
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс нажатой кнопке
            this.classList.add('active');
            
            // Отображаем соответствующий контент
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Инициализация опций товара
function initProductOptions() {
    // Выбор цвета
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Выбор размера
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Управление количеством
    const quantityInput = document.getElementById('quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    if (quantityInput && minusBtn && plusBtn) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
            }
        });
        
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
        });
    }
}

// Инициализация кнопки добавления в корзину
function initAddToCartButton(productId) {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    if (!addToCartBtn) return;
    
    addToCartBtn.addEventListener('click', function() {
        const quantityInput = document.getElementById('quantity-input');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        // Получаем выбранный цвет и размер
        const selectedColor = document.querySelector('.color-option.active');
        const selectedSize = document.querySelector('.size-option.active');
        
        // В реальном проекте здесь бы добавлялась информация о выбранном цвете и размере
        
        // Добавляем товар в корзину
        addProductToCart(productId, quantity);
    });
}

// Добавление товара в корзину с учетом количества
function addProductToCart(productId, quantity) {
    // Получаем корзину из localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // Если товар уже в корзине, увеличиваем количество
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Если товара нет в корзине, добавляем его
        cart.push({
            id: productId,
            quantity: quantity
        });
    }
    
    // Сохраняем корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновляем отображение корзины
    updateCartCount(cart);
    
    // Показываем сообщение об успешном добавлении
    alert('Товар добавлен в корзину!');
} 