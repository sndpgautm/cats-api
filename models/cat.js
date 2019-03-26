//Require Mongoose
const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;

const catSchema = new Schema({
    category : String,
    title : String,
    details : String,
    coordinates : {
        lat : Number,
        lng : Number
    },
    original : String,
    image : String,
    thumbnail : String,
    time : Date
});

// Virtual methods

module.exports = mongoose.model('Cat', catSchema);
