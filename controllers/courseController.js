const Course = require('../models/course');
const User = require('../models/User');

const course_index = (req, res) => {
  Course.find().sort({ createdAt: -1 })
    .then(result => {
      console.log('Courses:', result);
      res.render('courses', { courses: result, title: 'All courses' });
    })
    .catch(err => {
      console.log(err);
    });
}

const schedule_index = (req, res) => {
  Course.find().sort({ createdAt: -1 })
    .then(result => {
      console.log('Courses:', result);
      res.render('schedule', { courses: result, title: 'Schedule' });
    })
    .catch(err => {
      console.log(err);
    });
}

const course_details = (req, res) => {
  const id = req.params.id;
  Course.findById(id)
    .then(result => {
      res.render('details', { course: result, title: 'Course Details' });
    })
    .catch(err => {
      res.status(404).render('404', { title: 'Course not found' });
    });
}

const course_create_get = (req, res) => {
  res.render('create', { title: 'Create a new course' });
}

const course_create_post = (req, res) => {
  const course = new Course(req.body);
  course.save()
    .then(result => {
      res.redirect('/courses');
    })
    .catch(err => {
      console.log(err);
    });
}

const course_delete = (req, res) => {
  const id = req.params.id;
  Course.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/courses' });
    })
    .catch(err => {
      console.log(err);
    });
}

const course_edit_get = (req, res) => {
  const id = req.params.id;
  Course.findById(id)
    .then(result => {
      res.render('edit', { course: result, title: 'Edit Course' });
    })
    .catch(err => {
      res.status(404).render('404', { title: 'Course not found' });
    });
}

const course_edit_post = (req, res) => {
  const id = req.params.id;
  const { name, description, subject, credits } = req.body;
  Course.findByIdAndUpdate(id, { name, description, subject, credits }, { new: true })
    .then(result => {
      res.redirect('/courses');
    })
    .catch(err => {
      console.log(err);
    });
}

// const schedule_create_post = async (req, res) => {
//   const courseId = req.params.id;
//   const userId = req.user.id;

//   try {
//     await User.findByIdAndUpdate(userId, { $addToSet: { schedule: courseId }});

//   } 
//   catch (err) {
//   console.error('Error in addToSchedule:', err);
//   res.status(500).send('Internal Server Error: Unable to update schedule.');
// }
// };

// This is most recent
const schedule_create_post = async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user.id;
  // res.setHeader('Content-Type', 'application/json');
  try {
    // Check if the course is already in the user's schedule
    const user = await User.findById(userId);
    if (user.schedule.includes(courseId)) {
      // return res.status(400).send('Course already exists in the schedule');
      return res.status(400).json({ message: 'Course already exists in the schedule' });

    }

    // Add the course to the user's schedule
    user.schedule.push(courseId);
    await user.save();

    // console.log('Response Content:', res.getHeaders());
    // console.log('Response Headers:', res.getHeaders());
    
    // res.setHeader('Content-Type', 'application/json');

    // res.status(200).send('Course added to schedule successfully');
    res.status(200).json({ message: 'Course added to schedule successfully' });

  } catch (error) {
    console.error('Error adding course to schedule:', error);
    // res.status(500).send('Internal Server Error');
    res.status(500).json({ message: 'Internal Server Error' });

  }
};

// const schedule_create_post = async (req, res) => {
//   const userId = req.user._id; // Assuming user ID is available in req.user
//   const { courseId } = req.body;
//   try {
//     await User.findByIdAndUpdate(userId, { $addToSet: { schedule: courseId }});
//     // const courseId = req.params.courseId;

//     console.log(`UserId: ${userId}`)
//     // Step 1: Retrieve user and course information
//     const user = await User.findById(userId);
//     const course = await Course.findById(courseId);

//     // Step 2: Check for duplicate entries
//     if (!user.schedule.includes(courseId)) {
//         // Step 3: Add course to user's schedule
//         user.schedule.push(courseId);

//         // Step 4: Update user document
//         await user.save();
//         res.status(200).send('Course added to schedule successfully');
//     } else {
//         res.status(400).send('Course already exists in the schedule');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// };

module.exports = {
  course_index, 
  course_details, 
  course_create_get, 
  course_create_post, 
  course_delete,
  course_edit_get,
  course_edit_post,
  schedule_index,
  schedule_create_post
}