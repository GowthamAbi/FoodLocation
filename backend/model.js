const mongoose = require('mongoose')
const stallSchema = new mongoose.Schema({
    name: String,
    food_items: [String],
    location: {
        type: { type: String },
        coordinates: [Number], // [longitude, latitude]
    }
})

module.exports=mongoose.model('Stall', stallSchema,'stall')