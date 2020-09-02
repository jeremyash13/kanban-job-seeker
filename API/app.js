const express = require("express")
const { MongoClient, ObjectId } = require("mongodb")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()

const MONGODB_USERNAME = process.env.MONGODB_USERNAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD

// Connection URI
const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.ftljt.mongodb.net/seekr?retryWrites=true&w=majority`

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.options("*", cors())
app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,POST,DELETE",
  })
)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post("/items", async (req, res) => {
  try {
    client.connect().then(async () => {
      const database = client.db("seekr")
      const collection = database.collection("items")

      const { user } = req.body

      const findResult = await collection
        .find({
          user: user,
        })
        .toArray()
      res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT",
      })
      res.json(findResult)
    })
  } catch (err) {
    console.log(err)
  }
})
app.post("/newitem", async (req, res) => {
  try {
    client.connect().then(async () => {
      const { _id, user, role, company, status, note } = req.body

      let newDoc = {
        _id: ObjectId(_id.toString()),
        user: user,
        role: role,
        company: company,
        status: status,
        note: note,
      }

      const database = client.db("seekr")
      const collection = database.collection("items")

      await collection.insertOne(newDoc).then(() => {
        res.set({
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT",
        })
        res.json({ message: "SUCCESSFUL PUT REQUEST" })
      })
    })
  } catch (err) {
    console.log(err)
  }
})
app.post("/updateitem", async (req, res) => {
  try {
    client.connect().then(async () => {
      const { _id, user, role, company, status, note } = req.body

      const database = client.db("seekr")
      const collection = database.collection("items")

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
        .then(() => {
          res.set({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT",
          })
          res.json({ message: "SUCCESSFUL PUT REQUEST" })
        })
    })
  } catch (err) {
    console.log(err)
  }
})
app.post("/deleteitem", async (req, res) => {
  try {
    client.connect().then(async () => {
      const { _id } = req.body

      const database = client.db("seekr")
      const collection = database.collection("items")

      collection
        .deleteOne({
          _id: ObjectId(_id.toString()),
        })
        .then(() => {
          res.set({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT",
          })
          res.json({ message: "SUCCESSFUL DELETE REQUEST" })
        })
    })
  } catch (err) {
    console.log(err)
  }
})

module.exports = app
