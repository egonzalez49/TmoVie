const mongoose = require('mongoose');
const { Schema } = mongoose;
const FavoriteSchema = require('./Favorite');

const userSchema = new Schema({
  googleId: String,
  twitterId: String,
  email: { type: String, lowercase: true, trim: true },
  password: String,
  dateCreated: Date,
  first: String,
  last: String,
  avatar: String,
  favorites: [FavoriteSchema]
});

mongoose.model('users', userSchema);
