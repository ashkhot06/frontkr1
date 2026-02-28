const express = require('express');
const app = express();
const port = 3000;

let products = [
    { id: 1, name: 'Футбольный мяч Adidas', price: 4500 },
    { id: 2, name: 'Бутсы Nike Mercurial', price: 12000 },
    { id: 3, name: 'Форма сборной Бразилии', price: 6500 },
    { id: 4, name: 'Щитки защитные', price: 1800 },
    { id: 5, name: 'Вратарские перчатки', price: 3500 }
];

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Футбольный интернет-магазин');
});

app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Товар не найден' });
    }
});

app.post('/products', (req, res) => {
    const { name, price } = req.body;
    const newProduct = {
        id: Date.now(),
        name,
        price
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    const { name, price } = req.body;
    
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    
    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    products = products.filter(p => p.id != req.params.id);
    res.json({ message: 'Товар удален' });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});