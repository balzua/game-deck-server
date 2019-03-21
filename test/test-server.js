'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
mongoose.Promise = global.Promise;

const { Game } = require('../games');
const { User } = require('../users');
const { Library } = require('../library');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');

const expect = chai.expect;
chai.use(chaiHttp);

function seedGames() {
    let seedData = [];
    for (let i = 0; i < 2; i++) {
        seedData.push(generateGame());
    }
    return Game.insertMany(seedData);
}

function generateGame() {
    return {
        id: 3,
        user: 'testUser'
    };
}

function tearDownDb() {
    return mongoose.connection.dropDatabase();
}

describe('Test Server', function () {

    const user = {username: 'testUser'};
    const password = 'testPass';
    let token = jwt.sign({user}, JWT_SECRET, {
        subject: user.username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedGames();
    });
    
    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    describe('Games', function () {

        it('should post a new game successfully', function () {
            const newGame = { guid: 3030-61116 };
            return chai.request(app)
            .post('/games')
            .set('authorization', `Bearer ${token}`)
            .send(newGame)
            .then(function (res) {
                expect(res).to.have.status(201);
            });
        });
    
        it('should update games on PUT', function () {
            const updateData = {
                _id: 3,
                favorite: false
            };
            return Game.findOne()
            .then(function (toUpdateGame) {
                updateData.id = toUpdateGame._id;
                return chai.request(app).put(`/games/${updateData.id}`)
                .set('authorization', `Bearer ${token}`)
                .send(updateData);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
                return Game.findById(updateData.id);
            })
            .then(function(updatedGame) {
                expect(updateData.favorite).to.equal(updatedGame.favorite);
            });
        });
    
        it('should delete a game successfully', function () {
            let deleteGame;
            return Game.findOne()
            .then(function(_deleteGame) {
                deleteGame = _deleteGame;
                return chai.request(app)
                .delete(`/games/${deleteGame._id}`)
                .set('authorization', `Bearer ${token}`);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
        });
    });
});