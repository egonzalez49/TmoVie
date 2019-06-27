const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage: storage });

const User = mongoose.model('users');

module.exports = app => {
  app.patch('/api/account', upload.single('avatar'), async (req, res) => {
    console.log(req.file);
    const { first, last } = req.body;
    const x = await User.updateOne(
      {
        _id: req.user.id
      },
      {
        $set: { first, last, avatar: req.file.filename }
      }
    ).exec();

    console.log(x);
    const user = await User.findById({ _id: req.user.id });
    res.send(user);
  });
};
