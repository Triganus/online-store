// Массив товаров
const products = [
    {
        id: 1,
        title: "Базовая футболка",
        category: "women",
        price: 1290,
        image: "images/women/tshirt.svg",
        isNew: true,
        isSale: false,
        oldPrice: null,
        discount: null,
        description: "Базовая футболка из 100% хлопка с коротким рукавом и круглым вырезом.",
        colors: ["white", "black", "beige"],
        sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
        id: 2,
        title: "Джинсы с высокой посадкой",
        category: "women",
        price: 2990,
        image: "images/women/jeans.svg",
        isNew: true,
        isSale: false,
        oldPrice: null,
        discount: null,
        description: "Джинсы с высокой посадкой из плотного денима, прямого кроя.",
        colors: ["blue", "black"],
        sizes: ["34", "36", "38", "40", "42"]
    },
    {
        id: 3,
        title: "Оверсайз пиджак",
        category: "women",
        price: 4990,
        image: "images/women/blazer.svg",
        isNew: true,
        isSale: false,
        oldPrice: null,
        discount: null,
        description: "Пиджак свободного кроя с подплечниками, на подкладке.",
        colors: ["beige", "black", "grey"],
        sizes: ["XS", "S", "M", "L"]
    },
    {
        id: 4,
        title: "Платье-миди с принтом",
        category: "women",
        price: 3490,
        image: "images/women/dress.svg",
        isNew: false,
        isSale: true,
        oldPrice: 4990,
        discount: 30,
        description: "Платье-миди с флоральным принтом, свободного силуэта, с длинным рукавом.",
        colors: ["multi"],
        sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
        id: 5,
        title: "Базовая рубашка",
        category: "men",
        price: 1990,
        image: "images/men/shirt.svg",
        isNew: true,
        isSale: false,
        oldPrice: null,
        discount: null,
        description: "Классическая рубашка из хлопка с длинным рукавом.",
        colors: ["white", "light-blue", "striped"],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: 6,
        title: "Чиносы",
        category: "men",
        price: 2490,
        image: "images/men/chinos.svg",
        isNew: false,
        isSale: false,
        oldPrice: null,
        discount: null,
        description: "Брюки чиносы из хлопка, слегка зауженные к низу.",
        colors: ["beige", "navy", "olive"],
        sizes: ["30", "32", "34", "36", "38"]
    },
    {
        id: 7,
        title: "Кожаная куртка",
        category: "men",
        price: 7990,
        image: "images/men/jacket.svg",
        isNew: false,
        isSale: true,
        oldPrice: 11990,
        discount: 33,
        description: "Куртка из искусственной кожи с воротником-стойкой и прорезными карманами.",
        colors: ["black", "brown"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 8,
        title: "Хлопковый свитер",
        category: "men",
        price: 2990,
        image: "images/men/sweater.svg",
        isNew: true,
        isSale: false,
        oldPrice: null,
        discount: null,
        description: "Свитер из хлопковой пряжи с круглым вырезом и рибаной отделкой.",
        colors: ["grey", "navy", "bordeaux"],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: 9,
        title: "Серьги-кольца",
        category: "accessories",
        price: 990,
        image: "images/accessories/earrings.svg",
        isNew: false,
        isSale: false,
        oldPrice: null,
        discount: null,
        description: "Серьги-кольца из позолоченного серебра, диаметр 3 см.",
        colors: ["gold"],
        sizes: ["ONE SIZE"]
    },
    {
        id: 10,
        title: "Кожаный ремень",
        category: "accessories",
        price: 1490,
        image: "images/accessories/belt.svg",
        isNew: false,
        isSale: true,
        oldPrice: 1990,
        discount: 25,
        description: "Ремень из натуральной кожи с металлической пряжкой.",
        colors: ["black", "brown"],
        sizes: ["90 cm", "100 cm", "110 cm"]
    },
    {
        id: 11,
        title: "Солнцезащитные очки",
        category: "accessories",
        price: 1990,
        image: "images/accessories/sunglasses.svg",
        isNew: true,
        isSale: false,
        oldPrice: null,
        discount: null,
        description: "Солнцезащитные очки в квадратной оправе, 100% защита от UV-лучей.",
        colors: ["black"],
        sizes: ["ONE SIZE"]
    },
    {
        id: 12,
        title: "Шелковый шарф",
        category: "accessories",
        price: 1290,
        image: "images/accessories/scarf.svg",
        isNew: true,
        isSale: false,
        oldPrice: null,
        discount: null,
        description: "Шелковый шарф с цветочным принтом.",
        colors: ["multi"],
        sizes: ["ONE SIZE"]
    }
]; 