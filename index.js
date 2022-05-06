const express = require('express');
const cors = require('cors');
const res = require('express/lib/response');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcnkg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log('connected');
  // perform actions on the collection object
  client.close();
});


app.get('/', (req,res) => {
    res.send('running server');
});

app.listen(port, ()=>{
    console.log('listening on port');
})