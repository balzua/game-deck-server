'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Library = require('./models');

const router = express.Router();

router.get('/:user', (req, res) => {
    Library.findOne({user: req.params.user})
    .then(library => res.status(200).send(library))
    .catch(err => res.status(404).send({
        reason: 'NotFoundError',
        message: 'Library Not Found',
        user: req.params.user
    }));
});

module.exports = {router};

