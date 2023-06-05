const express = require('express')
const blogController = require('./controllers/blogController')
const mongoose = require('mongoose');
const userController = require('./controllers/userController');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const marked = require('marked');

 


const app = express();
const port = 3000;



app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const autheticateUser = (req, res, next) =>{
  const token = req.cookies.currentUser

  if (token) {
    jwt.verify(token, 'secret', (err, user) => {
      if (err) {
        res.redirect('/login')

      }
      req.user = user.id
      // console.log(user)
    });
    next()
  }
  else{
    // res.json('not authorised')
    res.redirect('/login')
    next();
  }

}


const dbUri = 'mongodb+srv://aakashdhanyamraju425:jTwl5bdUSsuQpYi4@aakashcluster1.h1scfqq.mongodb.net/blogDB'
mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(response => app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
  })).catch(err => console.log(err))



app.use(express.static('public'))



app.get('/', autheticateUser ,blogController.allBlogs)
app.post('/add',autheticateUser , blogController.createBlog)
app.get('/add',autheticateUser, (req, res) => {
    res.render('addBlog', {title: 'Add Blog', id: req.user})
})
app.delete('/blogs/:_id',autheticateUser , blogController.deleteBlog)
app.get('/blogs/:_id', autheticateUser ,blogController.getBlog)
app.get('/myblogs', autheticateUser, blogController.myBlogs)

app.get('/about',autheticateUser, (req, res) => {
    res.render('about', {title: 'About', id: req.user})

})


app.get('/users', autheticateUser ,userController.getAllUsers)
app.get('/users/:_id',autheticateUser , userController.findUserById)


app.get('/register', (req, res) => {
  res.render('register', {title: 'Register'})
})

app.get('/login', (req, res) => {
  res.render('login', {title: "Login"})

})


app.post('/register', userController.createUser)
app.post('/login', userController.login)
app.get('/logout', userController.logout)

// app.get('/add', (req, res) => {
//     res.render('addBlog', {title: "Add blog"})
// })



