const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const user = require('./models/user');


app.use(morgan('dev'));
app.use(express.json());

mongoose
  .connect("mongodb+srv://max:123max456@cluster0.alxllpq.mongodb.net/?retryWrites=true&w=majority")
  .then((data) => console.log(`Connected to MongoDB`))
  .catch((err) => console.error(`Failed to connect to MongoDB: ${err}`));

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.urlencoded({ extended: true }));


app.post("/refresh", async (req, res) => {
  const u = req.body;
  const un = await user.findOne({username: u[0]});
  try{
    if (un === null){
      await user.create({username:u[0], unread:[]});
      res.send(false);
    }
    else if (un.unread.length === 0){res.send(false);}
    else{
      let go = [];
      let left = [];
      un.unread.forEach(i => {
        if (i[0] === u[1]){go.push(i);}
        else{left.push(i);}
      });
      await user.updateOne({username:u[0]}, {unread:left});
      res.json(go);
    }
  } catch{
    res.send(false);
  }
});

app.post("/send", async (req, res) => {
  const data = req.body;
  const u = data.username;
  const m = data.msg;
  const og = await user.findOne({username:data.username});
  const fin = og.unread;
  fin.push(m);
  try{
    await user.updateOne({username:u}, {unread:fin});
  } catch {
    res.send(false);
  } finally{
    res.send(true);
  }
});

app.post("/new", async (req, res) => {
  const data = req.body
  const isthere = await user.findOne({username:data.username});
  if (isthere == null){
    await user.create({username:data.username, unread:[]});  
    res.send(true)
  }
  else{res.send(false);}
});


module.exports = app;