const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path'); 
const imgProcess = require('./imgProcess.js');
// Parse Application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/JSON
app.use(bodyParser.json());

// Using the created Cat Schema to create a cat instance
const Cat = require('../models/cat.js');

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
        const originalPath = req.file.path;
        const thumbPath = path.join('public', 'media', 'thumbnails', req.file.filename);
        req.body.original =  path.join('media', 'thumbnails', req.file.filename);
        req.body.image = originalPath;
        imgProcess.resize(originalPath, thumbPath, 400, 400).then((thumb) =>{
            console.log(thumb);
            req.body.thumbnail = thumb;
        }).catch(err => console.log('Error in resize function:' + err));
        
        req.body.time = Date.now();
        /*if(req.file.mimetype == 'png'){
            imgProcess.resize(originalPath, thumbPath, 512, 512);
            req.body.thumbnail = thumbPath;
        }*/
        imgProcess.getSpot(path.join(originalPath))
        .then((coords) =>{
            req.body.coordinates = coords;
            Cat.create(req.body, (err, obj) => {
                if (err){
                    console.log('Error in creating the Cat in cat.create: ' + err)
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
        Cat.find({}, (err, data) => {
            res.json(data);
        });
    });    
}