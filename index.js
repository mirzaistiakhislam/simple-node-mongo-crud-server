const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//username: crudUser
//password: 8mbi71kG0O8vKEfs
//dbUser2:tzGDcExDWhHfe6cZ

const uri = "mongodb+srv://dbUser2:tzGDcExDWhHfe6cZ@cluster0.iipillt.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();

        const userCollection = client.db("simple-node-mongo-crud").collection("users");

        app.get('/users', async (req, res) => {
            const query = {};
            const users = userCollection.find(query);
            const result = await users.toArray();
            res.send(result);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = req.body;

            const options = { upsert: true };
            const updateUser = {
                $set: {
                    name: user.updateName,
                    email: user.updateEmail,
                    phoneNumber: user.updatePhoneNumber
                }
            }
            const result = await userCollection.updateOne(query, updateUser, options);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })
    }

    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {

    console.log(`Example app listening on port ${port}`)
})