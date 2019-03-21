const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path'); 
const imgProcess = require('./imgProcess.js');
// Parse Application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/JSON
app.use(bodyParser.json());

// Creating a Schema for the cat
const Schema = mongoose.Schema;
const catSchema = new Schema({
    category: String,
    title: String,
    details: String,
    coordinates : {
        lat: Number,
        lng: Number
    },
    original: String,
    image : String,
    thumbnail : String,
    time: Date
});

// Using the created Cat Schema to create a cat instance
const Cats = mongoose.model('Cats', catSchema);

//Using Multer to get the image file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join('public', 'media','original' ));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
  
const upload = multer({ storage: storage });

module.exports = (app) => {
        
    ////////////////////POST////////////////////
    // Reading the Form to create a new Cat 
    app.post('/add', upload.single('original'), (req, res, next) => {
        const originalPath = path.join('media', 'original', req.file.filename);
        //const thumbPath = path.join('media/thumbnails/', req.file.filename);
        req.body.original = originalPath;
        req.body.image = originalPath;
        req.body.thumbnail = originalPath;
        req.body.time = Date.now();
        /*if(req.file.mimetype == 'png'){
            imgProcess.resize(originalPath, thumbPath, 512, 512);
            req.body.thumbnail = thumbPath;
        }*/
        imgProcess.getSpot(path.join('public', originalPath))
        .then((coords) =>{
            req.body.coordinates = coords;
            Cats.create(req.body, (err, obj) => {
                if (err){
                    console.log('Error in creating the Cat in cats.create: ' + err)
                } else {
                    console.log('Successfully added an entry to the database')
                    console.log(obj);
                }
            });

        }).catch(err => console.log('Error while calling the getSpot inside app.post: ' + err));
        res.redirect('/');
    });

    // Sending file to ./allCats URL to monitor the jSON arrays
    app.get('/allCats', (req, res) => {
        Cats.find({}, (err, data) => {
            res.json(data);
        });
    });    
}