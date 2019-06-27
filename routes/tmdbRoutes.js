const _ = require('lodash');
const mongoose = require('mongoose');
const tmdb = require('../services/tmdb');
const keys = require('../config/keys');

const Favorite = mongoose.model('favorites');
const User = mongoose.model('users');

module.exports = app => {
  app.post('/api/fave', async (req, res) => {
    const {
      itemId,
      title,
      poster_path,
      vote_average,
      overview,
      release_date,
      media_type
    } = req.body;

    const favorite = new Favorite({
      itemId,
      title,
      poster_path,
      vote_average,
      overview,
      release_date,
      media_type
    });

    req.user.favorites.push(favorite);
    const user = await req.user.save();
    res.send(user);
  });

  app.patch('/api/fave/:id', async (req, res) => {
    const itemId = parseInt(req.params.id);
    await User.updateOne(
      {
        _id: req.user.id
      },
      {
        $pull: { favorites: { itemId: itemId } }
      }
    ).exec();

    const user = await User.findById({ _id: req.user.id });
    res.send(user);
  });

  app.get('/api/movies', async (req, res) => {
    try {
      const apiResponse = await tmdb.get('/discover/movie', {
        params: {
          api_key: keys.tmdbKey,
          sort_by: 'popularity.desc',
          page: 1,
          region: 'US'
        }
      });
      res.send(apiResponse.data);
    } catch (error) {
      res.send(error);
    }
  });

  app.get('/api/search', async (req, res) => {
    try {
      const apiResponse = await tmdb.get(`/search/multi`, {
        params: {
          api_key: keys.tmdbKey,
          region: 'US',
          page: 1,
          query: req.query.query
        }
      });
      res.send(apiResponse.data);
    } catch (error) {
      res.send(error);
    }
  });

  app.get('/api/:type/:id', async (req, res) => {
    try {
      const apiResponse = await tmdb.get(
        `/${req.params.type}/${req.params.id}`,
        {
          params: {
            api_key: keys.tmdbKey,
            append_to_response: 'videos,images,credits'
          }
        }
      );
      res.send(apiResponse.data);
    } catch (error) {
      res.send(error);
    }
  });

  app.get('/api/config', async (req, res) => {
    try {
      const apiResponse = await tmdb.get('/configuration', {
        params: {
          api_key: keys.tmdbKey
        }
      });
      res.send(apiResponse.data);
    } catch (error) {
      res.send(error);
    }
  });
};
