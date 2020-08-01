const request = require('request');
var MongoClient = require('mongodb').MongoClient;
const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/mydb';
const fetch = require('node-fetch');
const app = express()

MongoClient.connect(url,{useNewUrlParser:true,useUnifiedTopology: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  app.use(express.json())

request({
  url:"https://randomuser.me/api/?inc=gender,name,location,email,dob,registered,phone,cell,id,nat&nat=NL&noinfo",
  json:true
},(err,response,body)=>{
  
  var test = JSON.stringify(body, undefined, 4);
  let test1 = body
 console.log(body.results[0].name.first);
    dbo.collection("customers").insertOne(body.results[0], function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
      }); 
    })
});


MongoClient.connect(url,{ useUnifiedTopology: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  //var query = { dob:{age:{ $gt: 20 }} };
dbo.collection("customers").find({ gender:"male",$and: [ { "dob.age": { $gt: 0, $lt: 30 }}]}).count(function(err, result) {
    if (err) throw err; 
    console.log("0-30:",result)
    db.close();
  });
  dbo.collection("customers").find({ gender:"female",$and: [ { "dob.age": { $gt: 30, $lt: 50 }}]}).count(function(err, result) {
    if (err) throw err; 
    console.log("0-50:",result)
    db.close();
  });
  dbo.collection("customers").find({ $and: [ { "dob.age": { $gt: 50 }}]}).count(function(err, result) {
    if (err) throw err;
    console.log("50-above:",result)
    db.close();
  });
});

app.listen(9000,()=>{
    console.log("server is running")
})
