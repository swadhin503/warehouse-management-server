const express = require('express');
const cors = require('cors');
const res = require('express/lib/response');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcnkg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        await client.connect();
        const itemCollection = client.db('warehouse_inventory').collection('items');
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const item = await itemCollection.findOne(query);
            res.send(item);
        })

        app.put('/items/:id', async (req, res)=>{
            const id = req.params.id;
            const updateItem = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedQuantity = {
                $set:{
                    quantity: updateItem.quantity
                }
            };
            const result = await itemCollection.updateOne(filter,updatedQuantity,options);
            res.send(result);
        })

        app.post('/items', async (req, res)=>{
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        })

        app.delete('/items/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })
        
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req,res) => {
    res.send('running server');
});

app.listen(port, ()=>{
    console.log('listening on port');
})