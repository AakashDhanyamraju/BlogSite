const { marked } = require('marked');
const Blog = require('../models/blogs');
const User = require('../models/users');

exports.allBlogs = async(req, res) => {

    try{
        const data = await Blog.find().sort({createdAt: -1});
        // console.log(data)
        // console.log(req.user)
        res.render('index', {title: 'Blogs',id: req.user , data})
        // console.log(res.cookies.json())
        // res.json(data)
    }
    catch(err){
        console.log(err)
    }

}

exports.myBlogs = async(req, res) => {

    try{
        const data = await Blog.find( {addedBy: req.user}).sort({createdAt: -1});

        // console.log(data)
        // console.log(req.user)
        res.render('myblogs', {title: 'my Blogs',id: req.user , data})
        // console.log(res.cookies.json())
        // res.json(data)
    }
    catch(err){
        console.log(err)
    }

}


exports.deleteBlog = async(req, res) => {
    try{
        const { _id } = req.params
        const blog = await Blog.find({_id: _id})
        const user = await User.find({_id: req.user})

        const role = user[0].role
        console.log(role)
        const userId = blog[0].addedBy
        console.log(typeof blog[0].addedBy)
        console.log(typeof req.user)
        if(role === 'admin'){
            const data = await Blog.findByIdAndRemove(_id).exec();
            return res.json({message: 'Admin deleted the blog'})
        }
        if(userId === req.user){
            const data = await Blog.findByIdAndRemove(_id).exec();
        // const message = { message: `${data.title} deleted` }
        // return res.render('message', {title : "message", message})
            return res.json({message: "Blog deleted"})
        }
        else{
            return res.json({message: 'not authorised to delete the blog'})
        }
        

    }catch(err){
        console.log(err)
    }
}

// exports.deleteBlog = async (req, res) => {
    

//   try{
//     const _id  = req.params

//     const blog = await Blog.findOneAndDelete({ _id : _id }).exec()

//     if(!blog){
//       res.status(404).json({ message : 'Blog not found'})
//     }
//     else{

//     }
//     res.status(201).json({username: username ,message : "Blog Deleted"})

//   }
//   catch(error){
//     res.status(500).json({error : error.message})
//   }

// }



exports.getBlog = async(req, res) => {
    try{
        
        const _id = req.params._id
        const blog = await Blog.findOne({_id: _id});

        var data = blog
        // console.log(data)
        // const user_id = data[0].addedBy

        const user = await User.find({_id: req.user })
        const admin = user[0].role;
        // console.log(admin)
        let isAdmin = false

        if(admin === 'admin'){
            isAdmin = true
        }
        // data[0]
        // data[admin] = isAdmin
        // console.log(data)

        res.render('blog', {title: data.title, id: req.user, data, admin: isAdmin})

    }catch(err){
        console.log(err)
    }
}

exports.createBlog = async (req, res) => {

    
    try {

    //   const title = await Blog.findOne({ title: req.body.title });
    // //   const email = await Blog.findOne({ email: req.body.email });
    //   if(title){
    //    return res.json({message: "title exists"})
        const htmlContent = marked(req.body.content)
    //   }
        const data = { title: req.body.title, author: req.body.author, image: req.body.image ,content: htmlContent, addedBy: req.user}
    // const data = req.body


      const newBlog = new Blog(data);
      
      const savedBlog = await newBlog.save();

      const message = { message: `${newBlog.title} created` }
      return res.render('message', {title : "message", id: req.user, message})

    //   return res.status(201).json({ message: 'Blog created'})
      // res.json(savedUser);
    } catch (message) {
    //   res.status(500).json({ message: error.message });
        return res.render('message', {title : "message", id: req.user, message})
    }
    // try {
    //     const data = req.body;
    
    //     // Check if a blog with the same title already exists
    //     const existingBlog = await Blog.findOne({ title: data.title });
    //     if (existingBlog) {
    //       return res.status(400).json({ message: 'Title already exists' });
    //     }
    
    //     const newBlog = new Blog(data);
    //     const savedBlog = await newBlog.save();
    
    //     return res.status(201).json({ message: 'Blog created' });
    //   } catch (error) {
    //     return res.status(500).json({ message: error.message });
    //   }
  };

