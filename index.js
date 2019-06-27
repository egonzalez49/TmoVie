const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./models/Item');
require('./services/passport');

const app = express();

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

app.use(bodyParser.json()); //req.body
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static('uploads'));

require('./routes/authRoutes')(app);
require('./routes/tmdbRoutes')(app);
require('./routes/commentRoutes')(app);
require('./routes/accountRoutes')(app);

//express behaving in production (send unknown routes to client build)
if (process.env.NODE_ENV === 'production') {
  //serve up production assets like main.js or .css
  app.use(express.static('/uploads', 'client/build'));
  //unknown route? return html
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
