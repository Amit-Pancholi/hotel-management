const {
  default: mongoose
} = require("mongoose");


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['guest', 'host'],
    default: 'guest'
  },
  favourite: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
  }]

})


module.exports = mongoose.model('User', userSchema);