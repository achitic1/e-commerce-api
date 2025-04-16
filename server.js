const express = require(`express`);
const app = express();
const PORTNUMBER = 5000;

app.use(express.json());

app.listen(PORTNUMBER, () => {
    console.log(`Server running at port: ${PORTNUMBER}`);
});

const products = [
    {
        id: 1,
        name: `Laptop`,
        price: 250.00
    }, 
    {
        id: 2,
        name: "Mini Fridge",
        price: 150.00
    },
    {
        id: 3,
        name: "Headphones",
        price: 180.00
    }
];

const cart = [];

app.get(`/`, (request, response) => {
    response.send(`Welcome to the storefront!`);
})

app.get(`/products`, (request, response) => {
    response.json(products); 
});

app.get(`products/:id`, (request, response) => {
    const product = products.find(p => p.id === parseInt(request.params.id));

    if(product) {
        response.json(product);
    } else {
        response.status(404).send(`Product not found`);
    }
});

app.post(`/cart`, (request, response) => {
    const { productId, quantity } = request.body;
    const product = products.find(p => p.id == parseInt(productId));

    if(product){
        cart.push(product);
        response.status(201).send(`${quantity} ${product.name} added to cart`);
    } else {
        response.status(404).send(`Product not found`);
    }
});

app.get(`/cart`, (request, response) => {
    response.json(cart);
});

app.delete(`/cart/:itemId`, (request, response) => {
    const {productId, quantity } = request.body;
    const product = products.find(p => p.id === parseInt(productId));

    if(product){
        cart.splice(cart.indexOf(product), 1);
        response.status(201).send(`${product.name} removed from cart`);
    } else {
        response.status(404).send(`Product not found`);
    }
});