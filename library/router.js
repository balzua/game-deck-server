'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const router = express.Router();

router.get('/:user', (req, res) => {

});

module.exports = {router};

