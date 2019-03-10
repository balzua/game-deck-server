'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const LibrarySchema = mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    private: {
        type: Boolean,
        required: true,
        default: true
    },
    chartScores: {
        action: {
            type: Number,
            required: true,
            default: 0
        },
        puzzleScore: {
            type: Number,
            required: true,
            default: 0
        },
        rpgScore: {
            type: Number,
            required: true,
            default: 0
        },
        fightingScore: {
            type: Number,
            required: true,
            default: 0
        },
        shooterScore: {
            type: Number,
            required: true,
            default: 0
        }
    },
    libraryStats: {
      favoriteGenre: {
        type: String,
        default: 'None'
      },
      totalCompleted: {
        type: Number,
        default: 0,
        required: true
      },
      averageRating: {
        type: Number,
        default: 0,
        required: true
      }
    },
    platforms: [String],
    games: [{type: mongoose.Schema.ObjectId, ref: "Game"}]
});

LibrarySchema.virtual('totalGames').get(function () {
  return this.games.length;
});

LibrarySchema.methods.serialize = function() {
  return {
    "games": this.games,
    "chartScores": this.chartScores,
    "platforms": this.platforms
  }
}

const Library = mongoose.model('Library', LibrarySchema);

module.exports = {Library};