require('dotenv').config();
const express = require('express');
const app = express();
//For jelastic ssl use
app.enable('trust proxy');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//Importing custom modules
const postRoute = require('./modules/postRoute.js');
const routes = require('./modules/routes.js');
//Parse Application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//Parse application/JSON
app.use(bodyParser.json());

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//Passport Authentication with local username and password
passport.use(
  new LocalStrategy((username, password, done) => {
    if (
      username !== process.env.username ||
      password !== process.env.password
    ) {
      done(null, false, { message: 'Incorrect credentials.' });
      return;
    }
    return done(null, { user: username }); // returned object usally contains something to identify the user.. returning password would be stupid
  })
);
app.use(passport.initialize());

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

//For local dev disabling https conenction
//Only enable when delpolying to git and jelastic
app.use((req, res, next) => {
  if (req.secure) {
    // request was via https, so do no special handling
    next();
  } else {
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url);
  }
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/test',
    session: false
  })
);

app.get('/test', (req, res) => {
  res.send('login fail');
});

//Handle routing
routes(app);
//Using PostRoute to post the data into db from the form
postRoute(app);
