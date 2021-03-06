const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const secret = process.env.stripe_secret;
const stripe = require ("stripe")(secret);
const routes = require('./routes.js');
const longpoll = require("express-longpoll")(app);

let data = {price: 0};


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, PUT" );
  next();
});
app.use(bodyParser.json());
app.use(routes);


app.post('/rg', (req, res, next) => {
  const body = req.body.cartList;
  console.log(body)
  let total = 0;
  total = body.reduce((prev, curr) => {
  return prev+curr.itemPrice
  }, total);
  data.price = total;
  res.send(data);
});

app.post('/button', (req, res, next) => {
  console.log(req.body);
  data.price = req.body.donation;
  console.log(data.price)
  res.send(data);
});

app.get('/confirm', (req, res, next) => {
  console.log('you are in confirm')
  console.log(data.price);
  res.send(data);
});

app.post('/reset', (req, res, next) => {
  data.price = 0;
});

longpoll.create("/poll");
longpoll.publish("/poll", data);
setInterval(() => longpoll.publish("/poll", data), 3000)




app.listen(process.env.PORT || 5000);

module.exports = app;
