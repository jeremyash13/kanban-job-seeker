const { MongoClient, ObjectId } = require("mongodb")

exports.handler = async event => {
  const MONGODB_USERNAME = process.env.MONGODB_USERNAME
  const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD

  // Connection URI
  const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.ftljt.mongodb.net/seekr?retryWrites=true&w=majority`

  // Create a new MongoClient
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  let response;

  async function run() {
    try {
      // Connect the client to the server
     response = await client
        .connect()
        .then(async () => {
          const database = client.db("seekr")
          const collection = database.collection("items")

          const { user } = event.body;

          const findResult = await collection
            .find({
              user: user,
            })
            .toArray();
            return findResult
        })
        .then(data => {
          return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: data,
          }
        })
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
      return response
    }
  }
  // run().catch(console.dir);

  return run()
}
