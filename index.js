const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var catSchema = new Schema({
    name: String,
    age: Number,
    gender: String,
    color: String,
    weight: Number,
});

var Cat = mongoose.model('Cat', catSchema);

mongoose.connect('mongodb://myTester:xyz123@localhost:27017/test', {useNewUrlParser: true}).then(() => {
    console.log('Connected successfully.');
    app.listen(3000, ()=> console.log('Listening on port 3000...'));
},err => {
    console.log('Connection to db failed: ' + err);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

