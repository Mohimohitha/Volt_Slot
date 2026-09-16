import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  stationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Station', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  bayNumber: { type: Number, required: true },
  vehicleRegNumber: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
  amountPaid: { type: Number, required: true },
  refundAmount: { type: Number, default: 0 },
  paymentStatus: { 
    type: String, 
    enum: ['Paid', 'Refunded', 'Partial-Refunded'], 
    default: 'Paid' 
  },
  status: { 
    type: String, 
    enum: ['Confirmed', 'Checked-In', 'Completed', 'Cancelled'], 
    default: 'Confirmed' 
  }
}, { timestamps: true });

// Prevent duplicate bookings on the exact same bay and timestamp
reservationSchema.index({ stationId: 1, bayNumber: 1, startTime: 1 });

export default mongoose.model('Reservation', reservationSchema);