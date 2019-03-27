const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const imgProcess = require('./imgProcess.js');
// Parse Application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/JSON
app.use(bodyParser.json());

// Using the created Cat Schema to create a cat instance
const Cat = require('../models/cat.js');

//Using Multer to get the image file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('public', 'media', 'original'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

//////////////////ALL CRUD OPERATIONS BELOW//////////////////
////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
module.exports = app => {
  // Reads the form to create a new Cat in database
  app.post('/add', upload.single('original'), (req, res, next) => {
    const originalPath = req.file.path;
    const thumbPath = path.join(
      'public',
      'media',
      'thumbnails',
      req.file.filename
    );
    req.body.original = path.join('media', 'thumbnails', req.file.filename);
    req.body.image = originalPath;
    imgProcess
      .resize(originalPath, thumbPath, 400, 400)
      .then(thumb => {
        console.log(thumb);
        req.body.thumbnail = path.join(
          'media',
          'thumbnails',
          req.file.filename
        );
      })
      .catch(err => console.log('Error in resize function:' + err));
    req.body.time = Date.now();
    imgProcess
      .getSpot(path.join(originalPath))
      .then(coords => {
        req.body.coordinates = coords;
        Cat.create(req.body, (err, obj) => {
          if (err) {
            console.log('Error in creating the Cat in cat.create: ' + err);
          } else {
            console.log('Successfully added an entry to the database');
            console.log(obj);
          }
        });
      })
      .catch(err =>
        console.log('Error while calling the getSpot inside app.post: ' + err)
      );
    res.redirect('/');
  });

  //Send all the data form cats collection in database
  app.get('/allCats', (req, res) => {
    Cat.find({}, (err, data) => {
      res.json(data);
    });
  });

  //Delete route for deleting the Entries from the database
  app.delete('/:id', (req, res) => {
    console.log('deleting with id: ' + req.params.id);
    Cat.deleteOne({ _id: req.params.id }, err => {
      if (err) {
        return console.log('Error in deleteOne: ' + err);
      }
      res.redirect('/');
    });
  });

  //Edit route to send form
  app.get('/edit/:id', (req, res) => {
    Cat.findOne({ _id: req.params.id }, (err, data) => {
      res.render('formEdit', {
        ID: data.id,
        category: data.category,
        title: data.title,
        details: data.details,
        original: data.original
      });
    });
  });

  //Handles PUT request from the edit form and updates data in database
  app.post('/edit', upload.single('original'), (req, res, next) => {
    const originalPath = req.file.path;
    const thumbPath = path.join(
      'public',
      'media',
      'thumbnails',
      req.file.filename
    );
    req.body.original = path.join('media', 'thumbnails', req.file.filename);
    req.body.image = originalPath;
    imgProcess
      .resize(originalPath, thumbPath, 400, 400)
      .then(thumb => {
        console.log(thumb);
        req.body.thumbnail = path.join(
          'media',
          'thumbnails',
          req.file.filename
        );
      })
      .catch(err => console.log('Error in resize function:' + err));
    req.body.time = Date.now();
    imgProcess
      .getSpot(path.join(originalPath))
      .then(coords => {
        req.body.coordinates = coords;
        Cat.findOneAndReplace(
          { _id: req.body.id },
          {
            $set: {
              category: req.body.category,
              title: req.body.title,
              details: req.body.details,
              coordinates: req.body.coordinates,
              time: req.body.time,
              original: req.body.original,
              image: req.body.image,
              thumbnail: req.body.thumbnail
            }
          },
          (err, cat) => {
            if (err) {
              console.log('Error in Cat.findOneAndReplace: ' + err);
            }
            console.log('succesfully updated cat object: ' + cat);
            cat.save();
            res.redirect('/');
          }
        );
      })
      .catch(err =>
        console.log('Error while calling the getSpot inside app.post: ' + err)
      );
  });
};
