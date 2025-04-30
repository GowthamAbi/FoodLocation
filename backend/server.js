const express = require('express');
const mongoose = require('mongoose');

const app = express();
const cors = require('cors');
app.use(cors());
mongoose.connect('mongodb+srv://gowthamabi1412:Gowtham2131%40@office.lrtep.mongodb.net/foodapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema
const stallSchema = new mongoose.Schema({
  name: String,
  food_items: [String],
  location: {
    type: { type: String },
    coordinates: [Number], // [longitude, latitude]
  }
});
stallSchema.index({ location: '2dsphere' });
const Stall = mongoose.model('Stall', stallSchema);

// Endpoint: Search stalls
app.get('/search', async (req, res) => {
  const { food, lat, lng } = req.query;

  const stalls = await Stall.find({
    food_items: { $regex: food, $options: 'i' },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: 5000 // 5 km radius
      }
    }
  }).limit(5);

  res.json(stalls);
});

app.listen(3000, () => console.log('Server running on port 3000'));
