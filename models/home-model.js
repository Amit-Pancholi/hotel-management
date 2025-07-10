const {
  default: mongoose
} = require("mongoose");

const homeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  image: String,
});

// homeSchema.pre('findOneAndDelete',async function(next){
//   const homeId = this.getQuery()._id;
//   await favouriteModel.deleteMany({homeId : homeId})
//   next();
// })
module.exports = mongoose.model('Home', homeSchema);