const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = require('./Comment');

const itemSchema = new Schema({
  itemId: Number,
  title: String,
  poster_path: String,
  media_type: String,
  comments: [CommentSchema]
});

mongoose.model('items', itemSchema);
