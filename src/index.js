const express = require('express')
const route = require('./route/route.js')
const mongoose = require('mongoose')
const multer = require('multer')
const app = express()
app.use(multer().any())

app.use(express.json())
mongoose.set('strictQuery', false);


mongoose.connect("mongodb+srv://abhay:abhayabhay@cluster0.6itwk6b.mongodb.net/Xhipment-Assignment?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch (err => console.log(err))

app.use('/',route);

app.listen(3000,function(){
    console.log('Express app running on Port 3000')
})