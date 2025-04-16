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

//Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || `Internal Server Error`
        }
    });
});

app.get(`/`, (request, response) => {
    console.log("Store front loaded");
    response.send(`Welcome to the storefront!`);
})

app.get(`/products`, (request, response) => {
    response.json(products); 
});

app.get(`/products/:id`, (request, response, next) => {
    try {
        const productId = parseInt(request.params.id);
        
        if(isNaN(productId)){
            const error = new Error(`Invalid Product ID`);
            error.status = 400;
            throw error;
        }

        const product = products.find(p => p.id === parseInt(request.params.id));

        if(!product){
            const error = new Error(`Product not found`);
            error.status = 400; 
            throw error;
        }

        response.json(product);
    } catch (err) {
        next(err);
    }
});

app.post(`/cart`, (request, response, next) => {
    try {
        const { productId, quantity } = request.body;

        if(isNaN(parseInt(productId)) || isNaN(parseInt(quantity))){
            const error = new Error(`Invalid Product ID or quantity`);
            error.status = 400;
            throw error;
        }

        const product = products.find(p => p.id == parseInt(productId));

        if(!product){
            const error = new Error(`Product not found`);
            error.status = 400; 
            throw error;
        }

        let numToAdd = quantity;

        while(numToAdd > 0) {
            cart.push(product);
            numToAdd--;
        }
        response.status(200).send(`${quantity} ${product.name}(s) added to your cart`);
    } catch (err) {
        next(err);
    }
});

app.get(`/cart`, (request, response) => {
    response.json(cart);
});

app.delete(`/cart/:productId/:quantity`, (request, response, next) => {
    try {
        const productId = parseInt(request.params.productId);
        const quantity = parseInt(request.params.quantity);

        if(isNaN(productId) || isNaN(quantity)){
            const error = new Error(`Invalid Product ID or quantity`);
            error.status = 400;
            throw error;
        }

        const product = products.find(p => p.id == parseInt(productId));

        if(!product){
            const error = new Error(`Product not found`);
            error.status = 400; 
            throw error;
        }

        let numToDelete = quantity;

        while(numToDelete > 0){
            cart.splice(cart.indexOf(product), 1);
            numToDelete--;
        }

        response.status(201).send(`${quantity} ${product.name}'s removed from cart`);
    } catch(err) {
        next(err);
    }
})


// USING BODY FOR A DELETE REQUEST APPARENTLY I SHOULD BE USING PARAMS IN THE URL
// app.delete(`/cart/:itemId`, (request, response, next) => {
//     try {
//         const {productId, quantity } = request.body;

//         if(isNaN(parseInt(productId)) || isNaN(parseInt(quantity))){
//             const error = new Error(`Invalid Product ID or quantity`);
//             error.status = 400;
//             throw error;
//         }

//         const product = products.find(p => p.id === parseInt(productId));

//         if(!product){
//             const error = new Error(`Product not found`);
//             error.status = 400; 
//             throw error;
//         }

//         let numToDelete = quantity;

//         while(numToDelete > 0) {
//             cart.splice(cart.indexOf(product), 1);
//             numToDelete--;
//         }

//         response.status(201).send(`${quantity} ${product.name}'s removed from cart`);
//     } catch(err) {
//         next(err);
//     }
// });