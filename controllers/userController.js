// require('dotenv').config()
const User = require('../models/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieParser = require('cookie-parser')
// const jwt = require('jsonwebtoken');
// const generateToken = require('../generatetoken');


const jwt = require('jsonwebtoken');


const generateToken = (id) => { 
    return jwt.sign({ id }, 'secret')
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        // console.log(req.session.user)
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
}


exports.createUser = async (req, res) => {
  try {
    // const user = await User.findOne({ username: req.body.username });
    const username = await User.findOne({ username: req.body.username });
    const email = await User.findOne({ email: req.body.email });
    if(username ){
     return res.json({message: "username exists"})
    }

    if(email){
     return res.json({message: "email exists"})
    }

    const password =req.body.password
    const hash = bcrypt.hashSync(password, 10);
    const newUser = new User({username: req.body.username, email: req.body.email, password: hash});
    
    const savedUser = await newUser.save();
    const user = await User.findOne({ username: req.body.username });


    const token = generateToken(user._id)
    res.cookie('currentUser', token)

    return res.status(201).json({ message: 'User created'})
    // res.json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// exports.findUser = async (req, res) => {
//     try {
//       const findUser = await User.find({username: req.body.username});
//       console.log(findUser.password)
//       if(req.body.password && bcrypt.compareSync(req.body.password, findUser.password)){
//         res.json("password Matching and user exist")
//       }
//       else{
//         res.json("password Not matching")
//       }
//       // const savedUser = await newUser.save();
      
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };


exports.findUserById = async (req, res) => {
    const _id  = req.user;
    // console.log(req.session.user)
  
    try {
      const user = await User.findOne({_id: _id});

      const data = user
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      else{
        return res.render('user', {title: user.username,id: req.user ,  data})
        // return res.json(user);
      }
  
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


exports.deleteUser = async (req, res) => {
    const { username } = req.params

  try{

    const user = await User.findOneAndDelete({ username : {$eq : username} }).exec()

    if(!user){
      res.status(404).json({ message : 'User not found'})
    }
    else{

    }
    res.status(201).json({username: username ,message : "User Deleted"})

  }
  catch(error){
    res.status(500).json({error : error.message})
  }

}

exports.updateUser = async (req, res) => {

  // const query = { username : req.params  };
  const { username }  = req.params;

  console.log(username)

  const update = req.body
  
  try {
    const user = await User.findOneAndUpdate({ username : {$eq : username} }, update, {new : true})
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }


}




// exports.findUser = async (req, res) => {
//   try {
//     const findUser = await User.find(req.body);
//     // const savedUser = await newUser.save();
//     res.json(findUser);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
exports.logout = async (req, res) => {
    res.cookie('currentUser', '', {maxAge: 1})
    res.redirect('/')
}

exports.login = async (req, res) => {
  try {
    const findUser = await User.findOne({email: req.body.email});
    
    if(!findUser){
      res.status(404).json({message : "no User found"})
    }
    // const username  = findUser.username
    // const accesstoken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET )
    // console.log(accesstoken)
  
    // const accessToken = generateToken(username)
    // res.json({accessToken})
    // console.log(req.body.password)
    // if(req.body.password){
    // bcrypt.compareSync(req.body.password, findUser.password) ? res.status(201).json({message:"login"}) : res.status(404).json({ message:"password not Matching" });
    if(bcrypt.compareSync(req.body.password, findUser.password)){

        // res.cookie('userdata', username)
        const token = generateToken(findUser._id)
        res.cookie('currentUser', token)
        res.status(200).json({message: 'Login'})

        // const cookies = req.user
        // console.log(cookies)

        
        // res.render('index')
      // req.session.user = findUser
      // console.log(req)

    //   const accessToken = generateToken(req.body.username)
    //   res.json({accessToken})
        
      // return res.json({message:"login"})
    }else{
      return res.status(404).json({ message: "password not Matching" })
    }

    // res.status(404).json({ message:"password not Matching" })
      // return true
    // }
    // const savedUser = await newUser.save();
    // else{
    //   res.status(404).json("enter password")
    // }
  } 
  catch (error) {
    // res.status(500).json({ error: error.message });
    console.log(error)
  }
};

