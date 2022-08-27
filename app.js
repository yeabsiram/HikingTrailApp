require('dotenv').config();
require('./api/Data/dbConn');

const express = require('express');
const bodyParser = require('body-parser');
const router = require('./api/Routes/');

const app = express();

app.use(function(req, res, next){
    
   
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', "GET, PUT, DELETE, POST, PATCH");
    res.header('Access-Control-Allow-Headers', 'Origin, XRequested-With, Content-Type, Accept, authorization');
    // res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})


app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use(function(req, res, next){
    console.log(req.url, req.method);
    next();
})

app.use("/api", router);

const port = process.env.PORT || 3000;
const server = app.listen(port, function(){
    console.log("Connected to", server.address().port);
});