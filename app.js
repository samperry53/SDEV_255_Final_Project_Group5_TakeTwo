const express = require('express');

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// listen for requests
app.listen(3000);

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