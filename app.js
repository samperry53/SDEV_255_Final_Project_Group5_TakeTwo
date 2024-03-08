const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { render } = require('ejs');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

// express app
const app = express();

// connect to mongodb
const dbURI = 'mongodb+srv://sperry53:help@finalprojectgroup5.mieuiqn.mongodb.net/?retryWrites=true&w=majority&appName=FinalProjectGroup5';
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});
app.use(express.json());
app.use(cookieParser);

app.get('/', (req, res) => {
    res.redirect('/courses');
});

// course routes
app.use('/courses', courseRoutes);

// auth routes
app.use(authRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404'});
})

// cookies
app.get('/set-cookies', (req, res) => {
    
    // res.setHeader('Set-Cookie', 'newUser=true');
    res.cookie('newUser', false);
    res.cookie('isEmployee', true { maxAge: 1000 * 60 * 60 * 24, secure: true, httpOnly: true });

    res.send('you got the cookies!');
});

app.get('/read-cookies', (req, res) => {

    const cookies = req.cookies;
    console.log(cookies.newUser);

    res.json(cookies);

});
