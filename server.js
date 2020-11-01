// THIS FILE IS NOT USED FOR PRODUCTION
// SAVE FOR LOCALLY TESTING THE API UNTIL I CAN GET AWS'S SAM CLI TO RUN THE SERVERLESS FUNCTIONS

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// require("dotenv").config();
// const express = require("express");
// const { MongoClient, ObjectId } = require("mongodb");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const app = express();
// const port = process.env.PORT || 4000;

// const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
// const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

// // Connection URI
// const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.ftljt.mongodb.net/seekr?retryWrites=true&w=majority`;

// // Create a new MongoClient
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// async function run() {
//   try {
//     // Connect the client to the server
//     await client.connect().then(() => {
//       app.options("*", cors());
//       app.use(
//         cors({
//           origin: "*",
//           methods: "GET,PUT,POST,DELETE",
//         })
//       );
//       app.use(bodyParser.urlencoded({ extended: true }));
//       app.use(bodyParser.json());

//       app.post("/items", async (req, res) => {
//         try {
//           const database = client.db("seekr");
//           const collection = database.collection("items");

//           const { user } = req.body;

//           const findResult = await collection
//             .find({
//               user: user,
//             })
//             .toArray();
//           res.json(findResult);
//         } catch (err) {
//           console.log(err);
//         }
//       });
//       app.post("/newitem", async (req, res) => {
//         try {
//           const { _id, user, role, company, status, note } = req.body;

//           let newDoc = {
//             _id: ObjectId(_id.toString()),
//             user: user,
//             role: role,
//             company: company,
//             status: status,
//             note: note,
//           };

//           const database = client.db("seekr");
//           const collection = database.collection("items");

//           const result = await collection
//             .insertOne(newDoc)
//             .then(() => res.json({ message: "SUCCESSFUL PUT REQUEST" }));
//         } catch (err) {
//           console.log(err);
//         }
//       });
//       app.post("/updateitem", async (req, res) => {
//         try {
//           const { _id, user, role, company, status, note } = req.body;

//           const database = client.db("seekr");
//           const collection = database.collection("items");

//           collection
//             .updateOne(
//               {
//                 _id: ObjectId(_id),
//               },
//               {
//                 $set: {
//                   user: user,
//                   role: role,
//                   company: company,
//                   status: status,
//                   note: note,
//                 },
//               }
//             )
//             .then(() => res.json({ message: "SUCCESSFUL PUT REQUEST" }));
//         } catch (err) {
//           console.log(err);
//         }
//       });
//       app.post("/deleteitem", async (req, res) => {
//         try {
//           const { _id, user } = req.body;

//           const database = client.db("seekr");
//           const collection = database.collection("items");

//           collection
//             .deleteOne({
//               _id: ObjectId(_id.toString()),
//             })
//             .then(() => res.json({ message: "SUCCESSFUL DELETE REQUEST" }));
//         } catch (err) {
//           console.log(err);
//         }
//       });

//       app.listen(port, () => {
//         console.log(`listening at http://localhost:${port}`);
//       });
//     });
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// ---------------------------------------------------------------------------------------------
// API/app.js (below)
// ---------------------------------------------------------------------------------------------

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
const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.ftljt.mongodb.net/retryWrites=true&w=majority`

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
            res.set({
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT",
            })
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
              res.set({
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT",
              })
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
              res.set({
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT",
              })
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
