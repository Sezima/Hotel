const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name : {
    type : String, 
    required : true, 
  },
  rating : {
    type : Number,
    required: true,
    min : 1,
    max : 5
  },
  location : {
    type : String,
    required : true
  },
  price_per_night: {
    type : Number,
    required : true
  },
  hotel_img : {
    type : Buffer,
    required : true
  }
})

hotelSchema.virtual("hotel_img_path").get(function () {
  if(this.hotel_img != null){
      return `data: image/png; charset=utf-8;base64,${this.hotel_img.toString("base64")}`
  }
})

module.exports = mongoose.model("Hotel", hotelSchema);
