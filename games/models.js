'use strict';
const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: String,
    description: String,
    image: String,
    rating: Number,
    userRating: {
      type: Number,
      default: 0
    },
    genres: [String],
    libraryStatus: {
      type: String,
      default: 'not-started'
    },
    hoursPlayed: {
      type: Number,
      default: 0
    },
    releaseDate: Date,
    platforms: [String],
    favorite: {
      type: Boolean,
      default: false
    },
    user: {
      type: String,
      required: true
    },
    dateAdded: {
      type: Date,
      default: Date.now
    }
});

GameSchema.methods.serialize = function() {
  const releaseDate = new Date(this.releaseDate);
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    image: this.image,
    rating: this.rating,
    genres: this.genres,
    platforms: this.platforms,
    releaseDate: `${releaseDate.getMonth() + 1}-${releaseDate.getDate()}-${releaseDate.getFullYear()}`,
    userRating: this.userRating,
    favorite: this.favorite,
    hoursPlayed: this.hoursPlayed,
    libraryStatus: this.libraryStatus,
  };
};

const Game = mongoose.model('Game', GameSchema);

module.exports = {Game, GameSchema};