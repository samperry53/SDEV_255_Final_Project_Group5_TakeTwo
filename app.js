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
app.use(express.json());
app.use(cookieParser());
app.use(checkUser);
app.use(authRoutes);
// app.get('*', checkUser);
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
app.use('/courses', requireAuth, courseRoutes);

// testing
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
  // res.redirect('/courses');
});
// routes
// app.get('/', (req, res) => {
//     console.log('Root route called');
//     console.log('req.user:', req.user);

//     if (res.locals.user !== null && res.locals.user !== undefined) {
//       console.log('User is authenticated');
//       console.log('User role:', res.locals.user.role);
      
//       if (res.locals.user.role === 'teacher') {
//         console.log('Rendering teacherIndex');
//         res.render('teacherIndex', { title: 'Home', user: res.locals.user });
//       } else if (res.locals.user.role === 'student') {
//         console.log('Rendering studentIndex');
//         res.render('studentIndex', { title: 'Home', user: res.locals.user });
//       } else {
//         console.log('User has an unknown role');
//         res.render('index', { title: 'Home', user: {} });
//       }
//     } else {
//       console.log('User is not authenticated');
//       res.render('index', { title: 'Home', user: {} });
//     }
//   });
  

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404'});
})
