const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port=process.env.PORT||5000
const app=express();
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bvs1s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run()
{
    try{
        await client.connect();
        const itemCollection=client.db('warehouseItems').collection('items')
        app.get('/item',async(req,res)=>{
            const query={};
            const cursor=itemCollection.find(query)
            const items=await cursor.toArray();
            res.send(items);
        })
        app.get('/inventory/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const item=await itemCollection.findOne(query)
            res.send(item)
        })
        app.post('/item',async(req,res)=>{
            const newItem=req.body;
            const result=await itemCollection.insertOne(newItem);
            res.send(result)
        })
     
    }
    finally
    {

    }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Running')
})

app.listen(port,()=>{
    console.log('Listening',port)
})

