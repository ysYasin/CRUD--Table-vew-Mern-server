const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5300



app.use(cors());
app.use(express.json())


const uri = "mongodb+srv://UserName:Password@cluster0.jo4ahje.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const userCollection = client.db("UsersDB").collection("users");

        app.get('/users', async (req, res) => {
            let users = await userCollection.find().toArray();
            res.send({ users })
        })

        app.post("/users", async (req, res) => {
            let userData = req.body;
            console.log(userData);
            const result = await userCollection.insertOne(userData);
            res.send(result);

        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            let users = await userCollection.findOne(filter);
            res.send(users)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const udpatedUser = {
                $set: {
                    name: body.name,
                    email: body.email,
                    address: body.address,
                    number: body.number
                }
            };
            const filter = { _id: new ObjectId(id) };
            const result = await userCollection.updateOne(filter, udpatedUser, { upsert: true })
            res.send(result);

        })

        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const deleteResul = await userCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(deleteResul)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Crus manupulate DATA")
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})