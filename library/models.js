'use strict';

const mongoose = require('mongoose');
const {GameSchema} = require('../games/models');

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
    genreScores: {
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
    games: [GameSchema],
    platforms: [String]
});

const Library = mongoose.model('Library', LibrarySchema);

module.exports = {Library};