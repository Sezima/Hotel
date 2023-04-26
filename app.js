const express = require("express")
const app = express()

const Hotel = require("./models/Hotel")

const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const mongodbURI = "mongodb+srv://Alishan:alishan@cluster0.ic7ifil.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true,})
    .then(() => console.log("connected to db"))
    .catch((err) => console.log("error from db is :", err))
;

const {checkUser} = require("./auth/middleware")
const authRoutes = require("./routes/authRoutes")

// ENDPOINTS 
app.use(express.json())
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(cookieParser());
app.use(express.urlencoded({extended : false}))

app.get("/", checkUser, async (req,res) => {
    
    let where = {}
    if(req.query.location != null && req.query.location != ""){
        where.location = req.query.location
    }
    if(req.query.rating != null && req.query.rating){
        where.rating = req.query.rating
    }
    console.log(where)
    const hotels = await Hotel.find(where)
    const uniqueCities = await Hotel.find().distinct("location")

    res.render("index", {hotels : hotels, searchValues : req.query, cities: uniqueCities})
})

app.use(authRoutes)

app.listen(3000, () => {
    console.log("listening on 3000")
})