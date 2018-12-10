const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());


const Port = process.env.Port || 3000 

app.listen(Port, () => {
    console.log(`Listening on Port ${Port}`)
})