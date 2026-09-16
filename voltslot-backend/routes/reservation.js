import express from 'express';
import { 
  bookSlot, 
  cancelReservation, 
  getUserReservations,
  getBayAvailability
} from '../controllers/reservationController.js';

const router = express.Router();

// Check bay occupancy in real-time before user hits payment
router.get('/availability/:stationId', getBayAvailability);

// Existing routes
router.post('/book', bookSlot);
router.post('/:id/cancel', cancelReservation);
router.get('/my-bookings', getUserReservations);
router.get('/user/:userId', (req, res, next) => {
  req.user = { id: req.params.userId };
  return getUserReservations(req, res, next);
});

export default router;