const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

// express app
const app = express();

// connect to mongodb
const dbURI = 'mongodb+srv://sperry53:help@finalprojectgroup5.mieuiqn.mongodb.net/?retryWrites=true&w=majority&appName=FinalProjectGroup5';
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// listen for requests
app.listen(3000);

// middleware and static files
app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    const courses = [
        {name: 'Biology', description: 'Science of Life', subject: 'Life Sciences', credits: '3'}
    ];
    res.render('index', { title: 'Home', courses });
});

app.get('/courses/create', (req, res) => {
    res.render('create', { title: 'Add A New Course'});
})

// 404 page
app.use((req, res) => {
    res.render('404', { title: '404'});
})