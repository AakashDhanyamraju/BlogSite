// import { Schema, model } from 'mongoose';
const mongoose = require('mongoose');


const blogSchema = new mongoose.Schema({
    title: {type: String, required: true },
    author: {type: String, required: true},
    content: {type: String, required: true},
    image: {type: String, required: true},
    // file: {
    //     filename: String,
    //     mimeType: String,
    //     size: Number,
    //     path: String,
    //   },
    addedBy: {type: String, required:true}
}, {timestamps: true})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;