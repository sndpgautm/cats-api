require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const express = require('express');
const app = express();


var catSchema = new Schema({
    name: String,
    age: Number,
    gender: String,
    color: String,
    weight: Number,
});

var Cat = mongoose.model('Cat', catSchema);

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/test`, {useNewUrlParser: true}).then(() => {
    console.log('Connected successfully.');
    app.listen(process.env.APP_PORT, ()=> console.log(`Listening on port...${process.env.APP_PORT}`));
},err => {
    console.log('Connection to db failed: ' + err);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

