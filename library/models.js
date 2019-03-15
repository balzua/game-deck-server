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
        actionScore: {
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
        },
        simScore: {
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
  
  let chartScores = {
    actionScore: 0,
    puzzleScore: 0,
    rpgScore: 0,
    fightingScore: 0, 
    shooterScore: 0,
    simScore: 0
  }
  const genres = {
    action: ['Action', 'Brawler', 'Vehiclular Combat', 'Platformer', 'Action-Adventure'],
    puzzle: ['Strategy', 'Adventure', 'Real-Time Strategy', 'Card Game', 'Trivia/Board Game', 'Puzzle'],
    rpg: ['Role-Playing', 'MMORPG'],
    fighting: ['Fighting', 'Wrestling', 'Brawler'],
    shooter: ['Shooter', 'Dual-Joystick Shooter', 'First-Person Shooter', 'Light-Gun Shooter', 'Shoot \'Em Up'],
    sim: ['Sports', 'Driving/Racing', 'Simulation']
  }
  this.games.forEach(game => {
    const score = game.userRating * 10    
    game.genres.forEach(genre => {
      if (genres.action.includes(genre)) {
        chartScores.actionScore += score;
      } else if (genres.puzzle.includes(genre)) {
        chartScores.puzzleScore += score;
      } else if (genres.rpg.includes(genre)) {
        chartScores.rpgScore += score;
      } else if (genres.fighting.includes(genre)) {
        chartScores.fightingScore += score;
      } else if (genres.shooter.includes(genre)) {
        chartScores.shooterScore += score;
      } else if (genres.sim.includes(genre)) {
        chartScores.simScore += score;
      }
    });
  });
  let totalScore = Object.values(chartScores).reduce((total, num) => total + num, 0);
  if (totalScore === 0) {
    totalScore = 1;
  }
  return {
    "games": this.games,
    "chartScores": {
      actionScore: Math.round(chartScores.actionScore / totalScore * 100),
      puzzleScore: Math.round(chartScores.puzzleScore / totalScore * 100),
      rpgScore: Math.round(chartScores.rpgScore / totalScore * 100),
      fightingScore: Math.round(chartScores.fightingScore / totalScore * 100),
      shooterScore: Math.round(chartScores.shooterScore / totalScore * 100),
      simScore: Math.round(chartScores.simScore / totalScore * 100)
    }
  }
}

const Library = mongoose.model('Library', LibrarySchema);

module.exports = {Library};