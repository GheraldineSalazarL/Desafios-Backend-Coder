import * as viewsService from '../../services/views.service.js';
import jwt from 'jsonwebtoken';
import config from '../../config/config.js';

const PRIVATE_KEY = config.secret;

const privateAccess = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
    jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
        req.session.user = decoded;
        next();
    });
    } else {
    res.redirect('/login');
    }
};

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/products'); 
    next();
}

const privateUserAccess = (req, res, next) => {
    if (req.session.user) {
        if(req.session.user.rol === "USER") {return next()};
    } 
    return res.redirect('/login')
}

const privateAdminAccess = (req, res, next) => {
    if (req.session.user) {
        if(req.session.user.rol === "ADMIN") {return next()};
    } 
    return res.redirect('/login')
}

const getAllProducts = async (req, res) => {
    try {
        const products = await viewsService.getAllProducts(); 
        res.render('home', {products, style: 'home.css'});
    } catch (error) {
        res.status(500).send({error});
    }
};

const saveDeleteProductsSocket = async (req, res) => {
    res.render('realTimeProducts', {style: 'realTimeProducts.css'});
};

const chat = (req, res) => {
    console.log(req.session.user.rol)
    res.render('chat', {style: 'chat.css'})
};

const getProductsPaginate = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, category, stock} = req.query;

        const result = await viewsService.getProductsPaginate(limit, page, sort, category, stock)

        res.render('products', {
            products : result.docs, 
            hasPrevPage : result.hasPrevPage,
            prevPage : result.prevPage,
            hasNextPage : result.hasNextPage,
            nextPage : result.nextPage,
            Page : result.page,
            user: req.session.user, 
            style: 'home.css'
        });
    } catch (error) {
        res.status(500).send({error});
    }
};

const getCart = async (req, res) => {
    try {
        console.log(`view cart: ${req.session.user.cart}`)
        let cid = req.session.user.cart;

        const cart = await viewsService.getCart(cid);

        res.render('cart', {cart, style: 'cart.css'})
    } catch (error) {
        res.status(500).send({error});
    }
};

const register = (req, res) => {
    res.render('register', { style: 'register.css' });
};

const login = (req, res) => {
    res.render('login', { style: 'login.css' });
};

const profile = (req, res) => {
    res.render('profile', {
        user: req.session.user
    });
};

export { 
    publicAccess, 
    privateAccess, 
    privateUserAccess, 
    privateAdminAccess,
    getAllProducts, 
    saveDeleteProductsSocket, 
    chat, 
    getProductsPaginate, 
    getCart, 
    register, 
    login, 
    profile
}