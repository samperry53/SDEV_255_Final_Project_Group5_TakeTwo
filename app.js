const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Course = require('./models/course');

// express app
const app = express();

// connect to mongodb
const dbURI = 'mongodb+srv://sperry53:help@finalprojectgroup5.mieuiqn.mongodb.net/?retryWrites=true&w=majority&appName=FinalProjectGroup5';
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// // listen for requests
// app.listen(3000);

// middleware and static files
app.use(express.static('public'));
app.use(morgan('dev'));

// // mongoose and mongo sandbox routes
// app.get('/add-course', (req, res) => {
//     const course = new Course({
//         name: 'new course',
//         description: 'a new course',
//         subject: 'tutorial',
//         credits: 3
//     });

//     course.save()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// })

// app.get('/all-courses', (req,res) => {
//     Course.find()
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// })

// app.get('/single-course', (req, res) => {
//     Course.findById('')
//     .then((result) => {
//         res.send(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// })


app.get('/', (req, res) => {
    const courses = [
        {name: 'Biology', description: 'Science of Life', subject: 'Life Sciences', credits: '3'}
    ];
    res.render('index', { title: 'Home', courses });
});

// course routes
app.get('/', (req, res) => {
    res.redirect('/courses');
});

app.get('/courses', (req, res) => {
    Course.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render('index', { title: 'All Courses', courses: result })
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/courses/create', (req, res) => {
    res.render('create', { title: 'Add A New Course'});
})

// 404 page
app.use((req, res) => {
    res.render('404', { title: '404'});
})