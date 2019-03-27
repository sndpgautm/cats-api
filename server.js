require('dotenv').config();
const express = require('express');
const app = express();

app.enable('trust proxy');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//Importing custom modules
const postRoute = require('./modules/postRoute.js');
const routes = require('./modules/routes.js');
//Parse Application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//Parse application/JSON
app.use(bodyParser.json());

//Connects to database
mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${
      process.env.DB_HOST
    }:${process.env.DB_PORT}/test`,
    { useNewUrlParser: true }
  )
  .then(
    () => {
      console.log('Connected successfully.');
      app.listen(process.env.APP_PORT, () =>
        console.log(`Listening on port...${process.env.APP_PORT}`)
      );
    },
    err => {
      console.log('Connection to db failed: ' + err);
    }
  );

app.use((req, res, next) => {
  if (req.secure) {
    // request was via https, so do no special handling
    next();
  } else {
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url);
  }
});

//Handle routing
routes(app);
//Using PostRoute to post the data into db from the form
postRoute(app);
