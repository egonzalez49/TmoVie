const mongoose = require('mongoose');

const Item = mongoose.model('items');
const Comment = mongoose.model('comments');

module.exports = app => {
  app.post('/api/comments', async (req, res) => {
    const { itemId, poster_path, media_type, title } = req.body;
    var item = await Item.findOne({ itemId });

    if (item) {
      res.send(item.comments);
    } else {
      item = await new Item({
        itemId,
        poster_path,
        media_type,
        title
      }).save();
      res.send(item.comments);
    }
  });

  app.post('/api/comments/new', async (req, res) => {
    const { itemId, name, content, avatar } = req.body;
    const item = await Item.findOne({ itemId });

    item.comments.push(
      new Comment({
        user: req.user.id,
        content,
        name,
        avatar,
        timeCreated: Date.now()
      })
    );

    const updated = await item.save();
    res.send(updated.comments);
  });

  app.delete('/api/comments', async (req, res) => {
    const { itemId, commentId } = req.body;
    const x = await Item.updateOne(
      {
        itemId
      },
      {
        $pull: { comments: { _id: mongoose.Types.ObjectId(commentId) } }
      }
    ).exec();

    console.log(x);

    const item = await Item.findOne({ itemId });
    res.send(item.comments);
  });
};
