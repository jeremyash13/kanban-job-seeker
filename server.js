require("dotenv").config()
const express = require("express")
const { MongoClient, ObjectId } = require("mongodb")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()

const port = 4000
const MONGODB_USERNAME = process.env.MONGODB_USERNAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD

// Connection URI
const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.kf0gtbe.mongodb.net/?retryWrites=true&w=majority`

// Create a new MongoClient
const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

async function run() {
  try {
    await client.connect().then(() => {
      const database = client.db("seekr")
      const collection = database.collection("items")

      app.use(cors())

      app.use(bodyParser.urlencoded({ extended: true }))
      app.use(bodyParser.json())

      app.post("/items", async (req, res) => {

        const { user } = req.body

        const findResult = await collection
          .find({
            user: user,
          })
          .toArray()
        res.json(findResult)
      })
      app.post("/newitem", async (req, res) => {
        try {
          const { _id, user, role, company, status, note } = req.body

          let newDoc = {
            _id: ObjectId(_id.toString()),
            user: user,
            role: role,
            company: company,
            status: status,
            note: note,
          }

          await collection.insertOne(newDoc).then(() => {
            res.json({ message: "SUCCESSFUL PUT REQUEST" })
          })
        } catch (err) {
          console.log(err)
        }
      })
      app.post("/updateitem", async (req, res) => {
        try {
          const { _id, user, role, company, status, note } = req.body

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
              res.json({ message: "SUCCESSFUL PUT REQUEST" })
            })
        } catch (err) {
          console.log(err)
        }
      })
      app.post("/deleteitem", async (req, res) => {
        try {
          const { _id } = req.body

          collection
            .deleteOne({
              _id: ObjectId(_id.toString()),
            })
            .then(() => {
              res.json({ message: "SUCCESSFUL DELETE REQUEST" })
            })
        } catch (err) {
          console.log(err)
        }
      })

      app.listen(port, () => {
        console.log(`Listening @ http://localhost:${port}`)
      })
    })
  } catch (err) {
    console.log(err)
  }
}
run()

module.exports = app
