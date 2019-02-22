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
    genres: [String],
    libraryStatus: String,
    hoursPlayed: Number,
    releaseDate: Date,
    platforms: [String],
    favorite: Boolean
});

const Game = mongoose.model('Game', GameSchema);

module.exports = {Game, GameSchema};