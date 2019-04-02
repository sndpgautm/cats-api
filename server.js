require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRound = 12; //okayish in 2019
const myPwd = 'demoPass';
//Use hasing only once when user creates password or changes it and store it in database
// bcrypt.hash(myPwd, saltRound, (err, hash) => {
//   // Store hash in the database
//   console.log(hash);
// });

const express = require('express');
const app = express();
//For jelastic ssl use
app.enable('trust proxy');
const mongoose = require('mongoose');
const pug = require('pug');
const path = require('path');
const catRouter = require('./routers/catRouter');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'public/views'));

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//Passport Authentication with local username and password stored in .env file in jelastic server
passport.use(
  new LocalStrategy((username, password, done) => {
    if (
      username !== process.env.username ||
      !bcrypt.compareSync(password, process.env.password)
    ) {
      console.log('print something');
      console.log(
        'Password sent: ' +
          password +
          'process.env.password' +
          process.env.password
      );
      bcrypt.hash(password, saltRound, (err, hash) => {
        console.log('hashed sent password: ' + hash);
      });
      done(null, false, { message: 'Incorrect credentials.' });
      return;
    }
    console.log('print something 2');
    return done(null, { user: username }); // return object usally contains something to identify the user.. returning password would be stupid
  })
);
app.use(passport.initialize());

// Connect to database
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

//For local dev disable https conenction
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

//Athenticating using passport and postman to send login data
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/test',
    session: false
  })
);

app.get('/test', (req, res) => {
  res.send('Login failed... Incorrect username and passowrd');
});

// Handle routing
// Serve static files from the public folder
app.use(express.static('public'));
app.use('/cats', catRouter);
