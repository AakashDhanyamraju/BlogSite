// import { Schema, model } from 'mongoose';
const mongoose = require('mongoose');


const blogSchema = new mongoose.Schema({
    title: {type: String, required: true },
    author: {type: String, required: true},
    content: {type: String, required: true},
    addedBy: {type: String, required:true}
}, {timestamps: true})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;