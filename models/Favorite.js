const mongoose = require('mongoose');
const { Schema } = mongoose;

const favoriteSchema = new Schema({
  itemId: Number,
  title: String,
  vote_average: Number,
  poster_path: String,
  release_date: String,
  overview: String,
  media_type: String
});

mongoose.model('favorites', favoriteSchema);
