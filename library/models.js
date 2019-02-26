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
    platforms: [String],
    games: [{type: mongoose.Schema.ObjectId, ref: "Game"}]
});

const Library = mongoose.model('Library', LibrarySchema);

module.exports = {Library};