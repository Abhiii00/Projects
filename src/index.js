const express=require('express')
const mongoose=require('mongoose')
const route=require('./route/route')
const multer=require('multer')
const app=express()

app.use(express.json())
app.use(multer().any())
<<<<<<< HEAD
//mongoose.connect('mongodb+srv://prince9871:BZjeaWxY1uTLCefz@cluster0.pelsn1m.mongodb.net/group60Database',{
mongoose.connect("mongodb+srv://abhay:abhayabhay@cluster0.6itwk6b.mongodb.net/group31Database?retryWrites=true&w=majority", {

=======

mongoose.connect("mongodb+srv://prince9871:BZjeaWxY1uTLCefz@cluster0.pelsn1m.mongodb.net/group60Database", {
>>>>>>> 3bc85a1e529f1bf670a063bbe1632ac279d7801b
    useNewUrlParser:true
})
    .then(()=>console.log("mongoDb connected"))
    .catch((err)=>err)

app.use('/',route)

app.use(function(req,res){
    return res.status(400).send("invalid url")
})

const prt=3000
app.listen(prt,function(){
    console.log('Express running on port '+prt)
})