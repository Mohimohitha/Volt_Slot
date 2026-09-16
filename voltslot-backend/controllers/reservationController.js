import mongoose from 'mongoose';
import Reservation from '../models/Reservation.js';
import Station from '../models/Station.js';

// 1. Check real-time bay availability to disable booked slots in UI Step 1
export const getBayAvailability = async (req, res) => {
  try {
    const { stationId } = req.params;
    const { startTime, durationMinutes = 45 } = req.query;

    if (!stationId || !startTime) {
      return res.status(400).json({ message: 'stationId and startTime are required.' });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + Number(durationMinutes) * 60000);

    // Find all active or confirmed reservations overlapping this time window
    const overlapping = await Reservation.find({
      stationId,
      status: { $in: ['Confirmed', 'Checked-In'] },
      $and: [
        { startTime: { $lt: end } },
        { endTime: { $gt: start } }
      ]
    }).select('bayNumber');

    const reservedBays = overlapping.map((r) => r.bayNumber);

    return res.status(200).json({ reservedBays });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. Create a reservation with strict concurrency check
export const bookSlot = async (req, res) => {
  try {
    const { stationId, bayNumber, startTime, durationMinutes, vehicleRegNumber, amountPaid } = req.body;
    
    // Defensive extraction of userId
    const rawUserId = req.user?.id || req.user?._id || req.body?.userId;

    if (!rawUserId) {
      return res.status(401).json({ message: 'User authentication required. Please sign in.' });
    }

    const userId = mongoose.Types.ObjectId.isValid(rawUserId)
      ? new mongoose.Types.ObjectId(rawUserId)
      : rawUserId;

    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationMinutes * 60000);

    if (start < new Date()) {
      return res.status(400).json({ message: 'Reservation start time must be in the future.' });
    }

    const station = await Station.findById(stationId);
    if (!station) {
      return res.status(404).json({ message: 'Station not found.' });
    }

    if (bayNumber < 1 || bayNumber > station.totalBays) {
      return res.status(400).json({ message: `Bay number must be between 1 and ${station.totalBays}.` });
    }

    // CONFLICT-FREE CHECK: Overlap query
    const existingConflict = await Reservation.findOne({
      stationId,
      bayNumber,
      status: { $in: ['Confirmed', 'Checked-In'] },
      $and: [
        { startTime: { $lt: end } },
        { endTime: { $gt: start } }
      ]
    });

    if (existingConflict) {
      return res.status(409).json({
        message: `Conflict: Bay ${bayNumber} is already reserved for this time window. Please select another bay or time.`
      });
    }

    const reservation = await Reservation.create({
      stationId,
      userId,
      bayNumber,
      vehicleRegNumber: vehicleRegNumber || 'AP03CD1234',
      startTime: start,
      endTime: end,
      durationMinutes,
      amountPaid: amountPaid || (durationMinutes * (station.pricingPerKwh / 2)),
      paymentStatus: 'Paid',
      status: 'Confirmed'
    });

    const populated = await Reservation.findById(reservation._id).populate(
      'stationId',
      'name address city powerOutputKw pricingPerKwh'
    );

    return res.status(201).json({
      message: 'Slot booked successfully!',
      reservation: populated || reservation
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. Cancellation with 100% or 50% refund logic
export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const rawUserId = req.user?.id || req.user?._id || req.body?.userId;

    const query = { _id: id };
    if (rawUserId) {
      const targetUserId = mongoose.Types.ObjectId.isValid(rawUserId)
        ? new mongoose.Types.ObjectId(rawUserId)
        : rawUserId;
      query.$or = [{ userId: targetUserId }, { userId: rawUserId }];
    }

    const reservation = await Reservation.findOne(query);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    if (reservation.status === 'Cancelled' || reservation.status === 'Completed') {
      return res.status(400).json({ message: `Cannot cancel a reservation that is already ${reservation.status}.` });
    }

    const now = new Date();
    let refundAmount = 0;
    let paymentStatus = 'Refunded';

    if (now < reservation.startTime) {
      refundAmount = reservation.amountPaid;
      paymentStatus = 'Refunded';
    } else if (now >= reservation.startTime && now < reservation.endTime) {
      refundAmount = Number((reservation.amountPaid * 0.5).toFixed(2));
      paymentStatus = 'Partial-Refunded';
    }

    reservation.status = 'Cancelled';
    reservation.refundAmount = refundAmount;
    reservation.paymentStatus = paymentStatus;
    await reservation.save();

    return res.status(200).json({
      message: `Reservation cancelled. Refund issued: ₹${refundAmount} (${now < reservation.startTime ? '100% full refund' : '50% mid-slot refund'}).`,
      reservation
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 4. Get user bookings with automatic status progression
export const getUserReservations = async (req, res) => {
  try {
    const rawUserId = req.user?.id || req.user?._id || req.params.userId || req.query.userId;
    if (!rawUserId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Cast string to MongoDB ObjectId if valid
    const targetUserId = mongoose.Types.ObjectId.isValid(rawUserId)
      ? new mongoose.Types.ObjectId(rawUserId)
      : rawUserId;

    const reservations = await Reservation.find({
      $or: [
        { userId: targetUserId },
        { userId: String(rawUserId) }
      ]
    })
      .populate('stationId', 'name address city powerOutputKw pricingPerKwh')
      .sort({ createdAt: -1 });

    const now = new Date();

    const updated = await Promise.all(
      reservations.map(async (booking) => {
        if (booking.status !== 'Cancelled') {
          if (now >= booking.endTime && booking.status !== 'Completed') {
            booking.status = 'Completed';
            await booking.save();
          } else if (now >= booking.startTime && now < booking.endTime && booking.status !== 'Checked-In') {
            booking.status = 'Checked-In';
            await booking.save();
          }
        }
        return booking;
      })
    );

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};