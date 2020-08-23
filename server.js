require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 4000;

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

// Connection URI
const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.ftljt.mongodb.net/seekr?retryWrites=true&w=majority`;

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect().then(() => {
      app.options("*", cors());
      app.use(
        cors({
          origin: "*",
          methods: "GET,PUT,POST,DELETE",
        })
      );
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());

      app.post("/items", async (req, res) => {
        try {
          const database = client.db("seekr");
          const collection = database.collection("items");

          const { user } = req.body;

          const findResult = await collection
            .find({
              user: user,
            })
            .toArray();
          res.json(findResult);
        } catch (err) {
          console.log(err);
        }
      });
      app.put("/items", async (req, res) => {
        try {
          const { user, role, company, status, note } = req.body;

          let newDoc = {
            _id: ObjectId(),
            user: user,
            role: role,
            company: company,
            status: status,
            note: note,
          };

          const database = client.db("seekr");
          const collection = database.collection("items");

          const result = await collection
            .insertOne(newDoc)
            .then(() => res.json({ message: "SUCCESSFUL PUT REQUEST" }));
        } catch (err) {
          console.log(err);
        }
      });
      app.put("/updateitem", async (req, res) => {
        try {
          const { _id, user, role, company, status, note } = req.body;

          const database = client.db("seekr");
          const collection = database.collection("items");

          collection
            .updateOne(
              {
                _id: ObjectId(_id),
              },
              {
                $set: {
                  user: user,
                  role: role,
                  company: company,
                  status: status,
                  note: note,
                },
              }
            )
            .then(() => res.json({ message: "SUCCESSFUL PUT REQUEST" }));
        } catch (err) {
          console.log(err);
        }
      });

      app.listen(port, () => {
        console.log(`listening at http://localhost:${port}`);
      });
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
