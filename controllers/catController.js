const Cat = require('../models/cat');
const imgProcess = require('../modules/imgProcess.js');
const path = require('path');

//Do all the database related crud operations here and call these functions in respective routes

// Display List of all Cats.
exports.cat_list = (req, res) => {
  Cat.find()
    .then(cats => {
      res.json(cats);
    })
    .catch(err => {
      console.log('Error in Cat.find: ' + err);
    });
};

// Display List of all Cats filtered by Cat.Title
exports.cat_list_filteredByTitle = (req, res) => {
  Cat.find()
    .where('title')
    .equals(req.params.filterByTitle)
    .exec()
    .then(cats => {
      res.json(cats);
    })
    .catch(err => {
      console.log('Error in Cat.find by title: ' + err);
    });
};

// Display Cat create form on GET.
exports.cat_create_get = (req, res) => {
  res.sendFile(path.join(__dirname, '../public/form.html'));
};

// Handle Cat create on POST.
exports.cat_create_post = (req, res) => {
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
      req.body.thumbnail = path.join('media', 'thumbnails', req.file.filename);
    })
    .catch(err => console.log('Error in resize function:' + err));
  req.body.time = Date.now();
  imgProcess
    .getSpot(path.join(originalPath))
    .then(coords => {
      req.body.coordinates = coords;
      Cat.create(req.body, (err, obj) => {
        if (err) {
          console.log('Error in creating the Cat in Cat.create: ' + err);
        } else {
          console.log('Successfully added an entry to the database');
          console.log(obj);
          res.redirect('/');
        }
      });
    })
    .catch(err =>
      console.log(
        'Error while calling the getSpot inside cat_create_post: ' + err
      )
    );
};

// Handle Cat delete on DELETE.
exports.cat_delete_delete = (req, res) => {
  Cat.deleteOne({ _id: req.params.id })
    .then(() => {
      console.log('Deleted Cat object with id: ' + req.params.id);
      res.redirect('/');
    })
    .catch(err => {
      console.log('Error in Cat.deleteOne: ' + err);
    });
};

// Display Cat update form on GET.
exports.cat_update_get = (req, res) => {
  Cat.findOne({ _id: req.params.id })
    .exec()
    .then(catDataRecieved => {
      res.render('formEdit', {
        ID: catDataRecieved.id,
        category: catDataRecieved.category,
        title: catDataRecieved.title,
        details: catDataRecieved.details,
        original: catDataRecieved.original
      });
    })
    .catch(err => {
      console.log('Error in Cat.findOne: ' + err);
    });
};

// Handle Cat update on POST.
exports.cat_update_post = (req, res) => {
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
      req.body.thumbnail = path.join('media', 'thumbnails', req.file.filename);
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
        (err, updatedCat) => {
          if (err) {
            console.log('Error in Cat.findOneAndReplace: ' + err);
          }
          console.log('Succesfully updated Cat object: ' + updatedCat);
          updatedCat.save();
          res.redirect('/');
        }
      );
    })
    .catch(err =>
      console.log('Error while calling the getSpot inside app.post: ' + err)
    );
};
