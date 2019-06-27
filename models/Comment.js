const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  name: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  timeCreated: Date,
  avatar: String,
  content: String
});

mongoose.model('comments', commentSchema);
