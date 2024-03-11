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
const bodyParser = require('body-parser');

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
    // res.setHeader('Content-Type', 'application/json');
    res.locals.path = req.path;
    // res.header(res.header("Access-Control-Allow-Headers", 
    // 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'));
    next();
});
app.use(express.json());
app.use(cookieParser());

// app.use(bodyParser.json());
app.use(checkUser);
app.use(authRoutes);
app.use('/courses', requireAuth, courseRoutes);

// routes
app.get('*', checkUser);
app.post('*', checkUser);

// // this works properly
app.get('/', requireAuth, (req, res) => {
  const { role } = res.locals.user.role;
    
  if (role === 'student') {
  res.render('studentIndex', { title: 'Home' });
  }
  if (role === 'teacher') {
    res.render('teacherIndex', { title: 'Home' });
  }
  else {
    res.render('index', { title: 'Home' });
  }
    // res.redirect('/courses');

});
// app.get('/courses', requireAuth, (req, res) => {
//     res.render('courses', { title: 'All Courses' });
// });

// this does not work properly
// app.get('/', (req, res) => {
//       console.log('Root route called');
//       console.log('req.user:', req.user);
  
//       if (res.locals.user !== null && res.locals.user !== undefined) {
//         console.log('User is authenticated');
//         console.log('User role:', res.locals.user.role);
        
//         if (res.locals.user.role === 'teacher') {
//           console.log('Rendering teacherIndex');
//           res.render('teacherIndex', { title: 'Home', user: res.locals.user });
//         } else if (res.locals.user.role === 'student') {
//           console.log('Rendering studentIndex');
//           res.render('studentIndex', { title: 'Home', user: res.locals.user });
//         } else {
//           console.log('User has an unknown role');
//           res.render('index', { title: 'Home', user: {} });
//         }
//       } else {
//         console.log('User is not authenticated');
//         res.render('index', { title: 'Home', user: {} });
//       }
//     });

// app.get('/', authMiddleware.requireAuth, (req, res) => {
//   const { role } = req.user;

//   if (role === 'teacher') {
//     Course.find()
//       .then(courses => {
//         res.render('teacherIndex', { title: 'Staff', courses });
//       })
//       .catch(err => {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//       });
//   } else {
//     res.status(403).send('Forbidden: Access denied for non-teachers.');
//   }
// });


// Express route for updating a course
app.get('/courses/edit/:id', async (req, res) => {
  try {
      const courseId = req.params.id;
      const course = await Course.findById(courseId); // Fetch course from the database
      if (!course) {
          return res.status(404).send("Course not found");
      }
      res.render('edit', { course }); // Render a page where the course can be updated
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});

// Express route for deleting a course
app.delete('/courses/delete/:id', async (req, res) => {
  try {
      const courseId = req.params.id;
      await Course.findByIdAndDelete(courseId); // Delete the course from the database
      res.status(200).send("Course deleted successfully");
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});
// I attempted this but nothing is working properly


// // Route to render the student's schedule page
// app.get('/schedule', requireAuth, async (req, res) => {
//   try {
//       // // Retrieve the courses that the student is registered for
//       // const studentId = req.user.id; // Assuming the student ID is available in the request user object
//       // const courses = await Course.find({ students: studentId }).populate('teacher'); // Assuming 'students' field in Course model contains student IDs

//       // Render the schedule page and pass the courses data to the view
//       res.render('schedule', { courses });
//   } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//   }
// });
// // Route to handle adding a course to the schedule
// app.post('/schedule', authMiddleware.requireAuth, async (req, res) => {
//   const { courseId } = req.body;
//   const userId = req.user.id;

//   try {
//     // Add the course to the user's schedule
//     await User.findByIdAndUpdate(userId, { $addToSet: { schedule: courseId } });
    
//     // Fetch the updated user information and courses
//     const user = await User.findById(userId);
//     const courses = await Course.find();

//     res.render('students', { title: 'Students', user, courses });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Route to handle dropping a course from the schedule
// app.post('/schedule/drop', authMiddleware.requireAuth, async (req, res) => {
//   const { courseId } = req.body;
//   const userId = req.user.id;

//   try {
//     // Remove the course from the user's schedule
//     await User.findByIdAndUpdate(userId, { $pull: { schedule: courseId } });

//     // Fetch the updated user information and courses
//     const user = await User.findById(userId);
//     const courses = await Course.find();

//     res.render('students', { title: 'Students', user, courses });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// });



// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404'});
})