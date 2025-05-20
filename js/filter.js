// Глобальные переменции для хранения фильтров
let activeFilters = {
    categories: ['all'],
    minPrice: 0,
    maxPrice: Infinity,
    sizes: [],
    colors: [],
    onSale: false,
    isNew: false
};

let activeSorting = 'default';
let filteredProducts = [];
let isFiltersVisible = false; // Новая переменная для отслеживания видимости фильтров

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeFilterToggle();
    
    // Инициализация диапазона цен на основе доступных товаров
    const prices = products.map(product => product.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    document.getElementById('min-price').placeholder = `От ${minPrice}`;
    document.getElementById('max-price').placeholder = `До ${maxPrice}`;
    
    applyFiltersAndSort();
});

// Инициализация переключателя фильтров
function initializeFilterToggle() {
    const toggleBtn = document.getElementById('toggle-filters');
    const filterContainer = document.getElementById('filter-container');
    
    if (toggleBtn && filterContainer) {
        // По умолчанию фильтры скрыты при загрузке страницы
        filterContainer.classList.remove('show');
        
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем всплытие события
            isFiltersVisible = !isFiltersVisible;
            
            toggleBtn.classList.toggle('active');
            filterContainer.classList.toggle('show');
            
            // Изменение иконки
            const icon = toggleBtn.querySelector('.fas.fa-chevron-down, .fas.fa-chevron-up');
            if (icon) {
                if (isFiltersVisible) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
        
        // Предотвращаем скрытие при клике внутри контейнера
        filterContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Скрываем фильтры при клике вне области фильтров (только на мобильных)
        document.addEventListener('click', () => {
            if (isFiltersVisible && window.innerWidth < 768) {
                toggleFiltersVisibility(false);
            }
        });
    }
}

// Инициализация обработчиков событий для фильтров
function initializeFilters() {
    // Категории
    document.querySelectorAll('input[name="category"]').forEach(input => {
        input.addEventListener('change', handleCategoryChange);
    });
    
    // Размеры
    document.querySelectorAll('input[name="size"]').forEach(input => {
        input.addEventListener('change', () => {
            updateSizeFilters();
            applyFiltersAndSort();
        });
    });
    
    // Цвета
    document.querySelectorAll('input[name="color"]').forEach(input => {
        input.addEventListener('change', () => {
            updateColorFilters();
            applyFiltersAndSort();
        });
    });
    
    // Скидки и новинки
    document.querySelectorAll('input[name="sale"], input[name="new"]').forEach(input => {
        input.addEventListener('change', () => {
            activeFilters.onSale = document.querySelector('input[name="sale"]:checked') !== null;
            activeFilters.isNew = document.querySelector('input[name="new"]:checked') !== null;
            applyFiltersAndSort();
        });
    });
    
    // Цена
    document.getElementById('apply-price').addEventListener('click', () => {
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        
        activeFilters.minPrice = minPriceInput.value ? parseInt(minPriceInput.value) : 0;
        activeFilters.maxPrice = maxPriceInput.value ? parseInt(maxPriceInput.value) : Infinity;
        
        applyFiltersAndSort();
        
        // Автоматически сворачиваем фильтры после применения цены
        if (window.innerWidth < 768) {  // Только на мобильных устройствах
            toggleFiltersVisibility(false);
        }
    });
    
    // Сортировка
    document.getElementById('sort-select').addEventListener('change', (e) => {
        activeSorting = e.target.value;
        applyFiltersAndSort();
    });
    
    // Сброс фильтров
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
}

// Обработка изменения категорий
function handleCategoryChange(e) {
    const allCategoryCheckbox = document.querySelector('input[name="category"][value="all"]');
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]:not([value="all"])');
    
    if (e.target.value === 'all' && e.target.checked) {
        // Если выбрано "Все", снимаем выделение с других категорий
        categoryCheckboxes.forEach(cb => cb.checked = false);
        activeFilters.categories = ['all'];
    } else {
        // Если выбрана конкретная категория
        if (e.target.checked) {
            // Снимаем выделение с "Все"
            allCategoryCheckbox.checked = false;
            
            // Добавляем категорию в фильтры, если её там нет
            if (!activeFilters.categories.includes(e.target.value) && activeFilters.categories.includes('all')) {
                activeFilters.categories = []; // Удаляем 'all'
            }
            
            if (!activeFilters.categories.includes(e.target.value)) {
                activeFilters.categories.push(e.target.value);
            }
        } else {
            // Удаляем категорию из фильтров
            activeFilters.categories = activeFilters.categories.filter(cat => cat !== e.target.value);
            
            // Если ничего не выбрано, выбираем "Все"
            if (activeFilters.categories.length === 0) {
                allCategoryCheckbox.checked = true;
                activeFilters.categories = ['all'];
            }
        }
    }
    
    applyFiltersAndSort();
}

// Обновление фильтров по размерам
function updateSizeFilters() {
    const selectedSizes = [];
    document.querySelectorAll('input[name="size"]:checked').forEach(input => {
        selectedSizes.push(input.value);
    });
    activeFilters.sizes = selectedSizes;
}

// Обновление фильтров по цветам
function updateColorFilters() {
    const selectedColors = [];
    document.querySelectorAll('input[name="color"]:checked').forEach(input => {
        selectedColors.push(input.value);
    });
    activeFilters.colors = selectedColors;
}

// Сброс всех фильтров
function resetFilters() {
    // Сброс категорий
    document.querySelectorAll('input[name="category"]').forEach(input => {
        input.checked = input.value === 'all';
    });
    
    // Сброс размеров
    document.querySelectorAll('input[name="size"]').forEach(input => {
        input.checked = false;
    });
    
    // Сброс цветов
    document.querySelectorAll('input[name="color"]').forEach(input => {
        input.checked = false;
    });
    
    // Сброс скидок и новинок
    document.querySelectorAll('input[name="sale"], input[name="new"]').forEach(input => {
        input.checked = false;
    });
    
    // Сброс цены
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    
    // Сброс сортировки
    document.getElementById('sort-select').value = 'default';
    
    // Сброс активных фильтров
    activeFilters = {
        categories: ['all'],
        minPrice: 0,
        maxPrice: Infinity,
        sizes: [],
        colors: [],
        onSale: false,
        isNew: false
    };
    
    activeSorting = 'default';
    
    applyFiltersAndSort();
    
    // Автоматически сворачиваем фильтры на мобильных устройствах
    if (window.innerWidth < 768) {
        toggleFiltersVisibility(false);
    }
}

// Применение фильтров и сортировки
function applyFiltersAndSort() {
    filteredProducts = filterProducts();
    sortProducts();
    displayProducts();
    updateFilteredCount();
}

// Фильтрация товаров по всем активным фильтрам
function filterProducts() {
    return products.filter(product => {
        // Фильтрация по категориям
        if (!activeFilters.categories.includes('all') && !activeFilters.categories.includes(product.category)) {
            return false;
        }
        
        // Фильтрация по цене
        if (product.price < activeFilters.minPrice || product.price > activeFilters.maxPrice) {
            return false;
        }
        
        // Фильтрация по размерам
        if (activeFilters.sizes.length > 0) {
            const hasMatchingSize = product.sizes.some(size => activeFilters.sizes.includes(size));
            if (!hasMatchingSize) return false;
        }
        
        // Фильтрация по цветам
        if (activeFilters.colors.length > 0) {
            const hasMatchingColor = product.colors.some(color => activeFilters.colors.includes(color));
            if (!hasMatchingColor) return false;
        }
        
        // Фильтрация по скидкам
        if (activeFilters.onSale && !product.isSale) {
            return false;
        }
        
        // Фильтрация по новинкам
        if (activeFilters.isNew && !product.isNew) {
            return false;
        }
        
        return true;
    });
}

// Сортировка отфильтрованных товаров
function sortProducts() {
    switch (activeSorting) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            // Сортировка по умолчанию (id товара)
            filteredProducts.sort((a, b) => a.id - b.id);
    }
}

// Отображение товаров на странице
function displayProducts() {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<div class="no-products">Товары не найдены. Попробуйте изменить параметры фильтрации.</div>';
        return;
    }
    
    let html = '';
    
    filteredProducts.forEach(product => {
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
                ${product.isNew ? `<span class="new-label">NEW</span>` : ''}
                ${product.discount ? `<span class="discount-label">-${product.discount}%</span>` : ''}
                <div class="product-details">
                    <h3 class="product-title"><a href="product.html?id=${product.id}">${product.title}</a></h3>
                    <div class="product-price">
                        <span class="current-price">${product.price} ₽</span>
                        ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ₽</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    productGrid.innerHTML = html;
}

// Обновление счетчика отфильтрованных товаров
function updateFilteredCount() {
    const filteredCount = document.getElementById('filtered-count');
    filteredCount.textContent = `Найдено товаров: ${filteredProducts.length}`;
}

// Стилизация для меток NEW 
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .new-label {
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: #4CAF50;
            color: white;
            padding: 5px 10px;
            font-size: 12px;
            font-weight: 600;
            z-index: 1;
        }
        
        .no-products {
            grid-column: 1 / -1;
            text-align: center;
            padding: 30px;
            color: var(--light-text);
        }
    `;
    document.head.appendChild(style);
});

// Функция для управления видимостью фильтров
function toggleFiltersVisibility(show) {
    const toggleBtn = document.getElementById('toggle-filters');
    const filterContainer = document.getElementById('filter-container');
    
    if (toggleBtn && filterContainer) {
        isFiltersVisible = show;
        
        if (show) {
            toggleBtn.classList.add('active');
            filterContainer.classList.add('show');
            const icon = toggleBtn.querySelector('.fas.fa-chevron-down, .fas.fa-chevron-up');
            if (icon) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        } else {
            toggleBtn.classList.remove('active');
            filterContainer.classList.remove('show');
            const icon = toggleBtn.querySelector('.fas.fa-chevron-down, .fas.fa-chevron-up');
            if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        }
    }
} 