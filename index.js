const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gtlcm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const carsData = client.db('bengal-tiger_db').collection('carsInfo');
        const shopReviews = client.db('bengal-tiger_db').collection('shopReviews');
        const orders = client.db('bengal-tiger_db').collection('bookingOrders');
        const usersCollection = client.db('bengal-tiger_db').collection('users');

        //Car POST API
        app.post('/carsInfo', async (req, res) => {
            const cars = req.body;
            const result = await carsData.insertOne(cars)
            // console.log(result);
            res.json(result)
        });

        //Car GET API
        app.get('/carsInfo', async (req, res) => {
            const cursor = carsData.find({});
            const cars = await cursor.toArray();
            res.send(cars)
        })

        //Car Single Item
        app.get('/carsInfo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carsData.findOne(query);
            res.send(result)
        })

        //DELETE Car API
        app.delete('/deleteProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carsData.deleteOne(query);
            // console.log(result);
            res.send(result)
        })

        //REVIEW POST API
        app.post('/shopReviews', async (req, res) => {
            const review = req.body;
            const result = await shopReviews.insertOne(review)
            // console.log(result);
            res.json(result)
        });

        //REVIEW GET API
        app.get('/shopReviews', async (req, res) => {
            const cursor = shopReviews.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        //POST ORDERS API
        app.post('/bookingOrders', async (req, res) => {
            const result = await orders.insertOne(req.body)
            // console.log(result);
            res.json(result)
        });

        //GET ORDERS BY EMAIL
        app.get('/bookingOrders/:email', async (req, res) => {
            // const id = req.params.id;
            // const query = { _id: ObjectId(id) };
            const result = await orders.find({ email: req.params.email }).toArray();
            // console.log(result);
            res.send(result)
        })

        //GET ALL ORDERS API
        app.get('/bookingOrders', async (req, res) => {
            const cursor = orders.find({});
            const result = await cursor.toArray();
            res.send(result)
        })


        //DELETE ORDER API
        app.delete('/deleteOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orders.deleteOne(query);
            // console.log(result);
            res.send(result)
        })


        //USER POST API 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            // console.log(result);
            res.json(result);
        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            // console.log(user);
            const filter = { email: user.email };
            const options = { upsert: true };

            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })




        //USER PUT API
        // app.put('/users', async (req, res) => {
        //     const user = req.body;
        //     console.log('PUT', user);
        //     const filter = { email: user.email };
        //     const options = { upsert: true };
        //     const updateDoc = { $set: user };
        //     const result = await usersCollection.updateOne(filter, updateDoc, options);
        //     res.json(result);
        // });


    }
    finally {
        // await client.close()
    }

} run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Let's start driving")
})

app.listen(port, () => {
    console.log('Server Running at', port)
})