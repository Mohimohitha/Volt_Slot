import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true, default: 'Tirupati' },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  totalBays: { type: Number, default: 4 },
  powerOutputKw: { type: Number, default: 60 },
  connectorTypes: [{ type: String, default: ['CCS2', 'Type 2'] }],
  pricingPerKwh: { type: Number, default: 18 },
  status: { type: String, enum: ['Active', 'Maintenance', 'Busy'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Station', stationSchema);