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
  deleteAt: {
    type: Date,
  },
});

// 🧠 Hook to set deleteAt = checkOut if not manually set
bookingSchema.pre("save", function (next) {
  if (!this.deleteAt && this.checkOut) {
    const checkoutDate = new Date(this.checkOut);
    checkoutDate.setHours(23, 59, 59, 999); // ⏰ Set to 23:59:59.999
    this.deleteAt = checkoutDate;
  }
  next();
});
  

module.exports = mongoose.model("Booking", bookingSchema);
