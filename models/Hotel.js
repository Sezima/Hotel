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
  isFree : {
    type : Boolean,
    required : true,
    default : true
  }
})

module.exports = mongoose.model("Hotel", hotelSchema);
