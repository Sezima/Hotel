const express = require("express")
const router = express.Router()

const multer = require("multer")
const upload = multer()

const Hotel = require("../models/Hotel")

router.get("/update-hotel/:id", async(req, res) => {
    const hotel = await Hotel.findById(req.params.id)
    res.render("new-hotel", {hotel})
})

router.post("/hotel/:id", upload.single("hotel_img"),async(req, res) => {
    console.log(req.file)
    const hotel = new Hotel({
        name : req.body.name,
        location : req.body.location,
        rating : req.body.rating,
        price_per_night : req.body.price_per_night,
        hotel_img : req.file.buffer
    })
    await hotel.save()
    res.redirect("/")
})

router.get("/hotel-delete/:name", async(req, res)=> {
    const hotel = await Hotel.deleteOne({name: req.params.name})
    
    res.send("deleted")
})

module.exports = router