const express = require('express');
const cors = require('cors');


const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;


let products = [
    { id: 1, name: 'Футбольный мяч Adidas Tiro', category: 'Мячи', description: 'Профессиональный мяч для матчей', price: 4500, stock: 15 },
    { id: 2, name: 'Бутсы Nike Mercurial Superfly', category: 'Обувь', description: 'Легкие бутсы для скорости', price: 12900, stock: 8 },
    { id: 3, name: 'Форма сборной Бразилии', category: 'Одежда', description: 'Домашняя форма, оригинал', price: 6500, stock: 12 },
    { id: 4, name: 'Щитки защитные Adidas', category: 'Защита', description: 'Легкие щитки для голени', price: 1800, stock: 20 },
    { id: 5, name: 'Вратарские перчатки Reusch', category: 'Защита', description: 'Профессиональные перчатки', price: 4200, stock: 6 },
    { id: 6, name: 'Гетры футбольные Nike', category: 'Одежда', description: 'Дышащие гетры', price: 800, stock: 25 },
    { id: 7, name: 'Сумка для бутс Adidas', category: 'Аксессуары', description: 'Водонепроницаемая сумка', price: 2100, stock: 10 },
    { id: 8, name: 'Мяч для футзала Select', category: 'Мячи', description: 'Специальный мяч для зала', price: 3200, stock: 7 },
    { id: 9, name: 'Фишки тренировочные', category: 'Инвентарь', description: '20 штук в наборе', price: 1500, stock: 5 },
    { id: 10, name: 'Манишки тренировочные', category: 'Инвентарь', description: 'Набор 10 штук', price: 2500, stock: 4 }
];


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Футбольный магазин API',
            version: '1.0.0',
            description: 'API для управления товарами футбольного интернет-магазина',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный ID товара (числовой)
 *         name:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена в рублях
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *       example:
 *         id: 1
 *         name: "Футбольный мяч Adidas Tiro"
 *         category: "Мячи"
 *         description: "Профессиональный мяч для матчей"
 *         price: 4500
 *         stock: 15
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить все товары
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список всех товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
    res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Новый мяч"
 *               category:
 *                 type: string
 *                 example: "Мячи"
 *               description:
 *                 type: string
 *                 example: "Качественный мяч"
 *               price:
 *                 type: number
 *                 example: 3500
 *               stock:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка в данных
 */
app.post('/api/products', (req, res) => {
    const { name, category, description, price, stock } = req.body;
    
    if (!name || !category || !description || !price || stock === undefined) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    
  
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
    const newId = maxId + 1;
    
    const newProduct = {
        id: newId,
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock)
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Обновленный товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.patch('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    const { name, category, description, price, stock } = req.body;
    
    if (name) product.name = name.trim();
    if (category) product.category = category.trim();
    if (description) product.description = description.trim();
    if (price) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    
    res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удален
 *       404:
 *         description: Товар не найден
 */
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const exists = products.some(p => p.id === id);
    if (!exists) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    products = products.filter(p => p.id !== id);
    res.status(204).send();
});


app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});


app.use((err, req, res, next) => {
    console.error('Ошибка:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger документация: http://localhost:${port}/api-docs`);
});