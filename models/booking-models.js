const { mongoose } = require("mongoose");

const bookingSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: true,
  },
  guestEmail: {
    type: String,
    required: true,
  },
  guestPhone: {
    type: String,
    required: true,
  },
  homeName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Home",
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

//  for check booking is complete or not 
bookingSchema.virtual("isCompleted").get(function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return this.checkOut < today;
});


module.exports = mongoose.model("Booking", bookingSchema);
