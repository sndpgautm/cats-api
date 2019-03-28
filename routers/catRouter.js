const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const imgProcess = require('../modules/imgProcess.js');
const catController = require('../controllers/catController');

// Parse Application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: true }));
// Parse application/JSON
router.use(bodyParser.json());

// GET request for list of all Cat items.
router.get('/all', catController.cat_list);

// GET request for filtered list of all Cat item by title
router.get('/all/:filterByTitle', catController.cat_list_filteredByTitle);

// GET request for creating Cat
router.get('/new', catController.cat_create_get);

// POST request for creating Cat
router.post(
  '/add',
  imgProcess.upload.single('original'),
  catController.cat_create_post
);

// DELETE request to delete Cat
router.delete('/:id', catController.cat_delete_delete);

// GET request for editing Cat
router.get('/edit/:id', catController.cat_update_get);

// POST request to update Cat
router.post(
  '/edit',
  imgProcess.upload.single('original'),
  catController.cat_update_post
);

module.exports = router;
