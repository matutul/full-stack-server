const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sghan.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("Database connection errors: ", err);

    const cakesCollection = client.db(process.env.DB_NAME).collection("items");
    const ordersCollection = client.db(process.env.DB_NAME).collection("orders");
    console.log("Database connected succesfully");

    app.get('/cakes', (req, res) => {
        cakesCollection.find({})
            .toArray((err, cakes) => {
                res.send(cakes);
            })
    })
    app.post('/addCake', (req, res) => {
        cakesCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/cake/:id', (req, res) => {
        cakesCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, result) => {
                res.send(result[0]);
            })
    })
    app.post('/placeOrder', (req, res) => {
        ordersCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.post('/orders', (req, res) => {
        ordersCollection.find({ email: req.body.email })
            .toArray((err, items) => {
                res.send(items)
            })
    })
    app.post('/deleteCake', (req, res) => {
        console.log(req.body.id)
        cakesCollection.deleteOne({
            _id: ObjectId(req.body.id)
        })
            .then(result => {
                res.send(result.deletedCount > 0 );
            })
    })

});


app.listen(port)