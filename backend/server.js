const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");

const url = "mongodb://admin:password1@ds225375.mlab.com:25375/mymongodb";
const port = 4000;
let dbClient;

MongoClient.connect(url, { useNewUrlParser: true })
.then(client => {
  dbClient = client;
  const db = client.db('mymongodb');
  const collection = db.collection('collect');
  app.listen(port, () => console.info(`REST API running on port ${port}`));
  app.locals.collection = collection;
}).catch(error => console.error(error));

// listen for the signal interruption (ctrl-c)
process.on('SIGINT', () => {
  dbClient.close();
  process.exit();
});

app.use(bodyParser.raw({ type: "*/*" }));

app.post("/postReview", (req, res)=>{
  let review = JSON.parse(req.body);
  const collection = req.app.locals.collection;
  collection.insertOne(review, (err, result)=>{
    if(err) throw err;
    console.log("success");
    let response = {
      status:true,
      message: "Document successfully inserted"
    }
    res.send(JSON.stringify(response))
  });
});

app.get("/getReviews", (req, res) => {
  const collection = req.app.locals.collection;
  collection.find({}).toArray((err, result)=>{
    if(err) throw err;
    console.group(result);
    let response = {
      status: true,
      reviews: result
    }
    res.send(JSON.stringify(response))
  });
});

app.post("/searchByName", (req, res) => {
  let searchName = JSON.parse(req.body);
  let query = {
    username: searchName
  }
  console.log(query);
  const collection = req.app.locals.collection;
  collection.find(query).toArray((err, result)=>{
    if(err) throw err;
    let response = {
      status:true,
      reviews: result
    }
    console.log(response);
    res.send(JSON.stringify(response))
  });
});

app.post("/searchByDesc", (req, res) => {
  let searchWord = JSON.parse(req.body);
  let regexSearch = new RegExp(searchWord)
  const collection = req.app.locals.collection;
  collection.find({"review" : {$regex : regexSearch}}).toArray((err, result)=>{
    if(err) throw err;
    let response = {
      status:true,
      reviews: result
    }
    console.log(response);
    res.send(JSON.stringify(response))
  });
});
