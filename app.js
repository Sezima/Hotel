const express = require("express")
const app = express()

const multer = require("multer")

const upload = multer()
const Hotel = require("./models/Hotel")

const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const mongodbURI = "mongodb+srv://Alishan:alishan@hotel-project.sav1uvb.mongodb.net/?retryWrites=true&w=majority";
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
    const hotels = await Hotel.find(where)
    const uniqueCities = await Hotel.find().distinct("location")

    res.render("index", {hotels : hotels, searchValues : req.query, cities: uniqueCities})
})

app.use(authRoutes)

app.get("/new-hotel", (req, res) => {
    res.render("new-hotel")
})

app.post("/hotel", upload.single("hotel_img"),async(req, res) => {
    // console.log("req.file", req.file)
    const hotel = new Hotel ({
        name : req.body.name,
        location : req.body.location,
        rating : req.body.rating,
        price_per_night : req.body.price_per_night,
        hotel_img : req.file[0].buffer
    })
    res.send("File")
    await hotel.save()
})

app.get("/hotel1", async(req, res)=> {
    const hotel = await Hotel.findById("644e1925b830b714a2af1186")
    res.render("view", {hotel : hotel})
})

app.listen(3000, () => {
    console.log("listening on 3000")
})