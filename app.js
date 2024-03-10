const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { render } = require('ejs');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const Course = require('./models/course');
const User = require('./models/User');

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
app.use(cookieParser());
app.use(checkUser);
app.use(authRoutes);
app.use('/courses', requireAuth, courseRoutes);

// routes
app.get('*', checkUser);
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
    // res.redirect('/courses');
});
// app.get('/courses', requireAuth, (req, res) => {
//     res.render('courses', { title: 'All Courses' });
// });

// course routes

// auth routes


// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404'});
})
