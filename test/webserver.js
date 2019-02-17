'use strict';

const express = require('express');
const app = express();

const start = () => {
  console.log('Starting server');

  app.get('/nolocation', (req, res) => res.sendStatus(302));

  app.get('/meta', (req, res) => res.send('<META http-equiv="refresh" content="0; url=http://localhost:9000/1">'));

  app.get('/:number', (req, res) => {
    let number = req.params.number;
    if (number > 1) {
      res.redirect('http://localhost:9000/' + (--number));
    } else {
      res.send("That's it!");
    };
  });

  app.listen(9000, function () {
    console.log('Web server listening on port 9000!')
  });
};

module.exports = {
  'start': start
};