const express = require("express")
const app = express()

const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const mongodbURI = "mongodb+srv://Alishan:alishan@hotel-project.sav1uvb.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true,})
    .then(() => console.log("connected to db"))
    .catch((err) => console.log("error from db is :", err))
;

const Hotel = require("./models/Hotel")
const {checkUser} = require("./auth/middleware")
const authRoutes = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HOTEL APP',
      version: '1.0.0',
    },
    servers: [
        {
            url : "http://localhost:3000/"
        }
    ]
  },
  apis: ['./routes/authRoutes.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ENDPOINTS 
app.use(express.json())
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(cookieParser());
app.use(express.urlencoded({extended : false}))

app.use("/auth", authRoutes)
app.use("/admin", adminRoutes)

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

app.get("/hotel/:id", checkUser, async(req, res) => {
    try{
        const hotel = await Hotel.findById(req.params.id)
        res.render("hotel", {hotel})    
    }catch(err){
        console.log("error", err)
        console.log("Error Finding Hotel")
        res.redirect("/")
    }
})

app.listen(3000, () => {
    console.log("listening on 3000")
})