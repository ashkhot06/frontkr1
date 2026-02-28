const express = require('express');
const cors = require('cors');
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
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    res.json(product);
});

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

app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const exists = products.some(p => p.id === id);
    if (!exists) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    products = products.filter(p => p.id !== id);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});