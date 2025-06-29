const {
  default: mongoose
} = require("mongoose");

const favourite = mongoose.Schema({
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('favourite',favourite);