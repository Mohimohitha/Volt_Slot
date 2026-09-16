import express from 'express';
import Station from '../models/Station.js';
import {
  getNearbyStations,
  syncOpenChargeMapStations,
  seedStations
} from '../controllers/stationController.js';

const router = express.Router();

// 1. Get nearby stations with maxDistance filtering
router.get('/nearby', getNearbyStations);

// 2. Sync with Open Charge Map or generate dynamic local fallback
router.post('/sync', syncOpenChargeMapStations);

// 3. Seed default stations
router.post('/seed', seedStations);

// 4. One-time purge endpoint to clean duplicate database records
router.delete('/purge-duplicates', async (req, res) => {
  try {
    const stations = await Station.find({});
    const seen = new Set();
    const duplicateIds = [];

    for (const st of stations) {
      const key = `${st.name?.trim().toLowerCase()}-${st.address?.trim().toLowerCase()}`;
      if (seen.has(key)) {
        duplicateIds.push(st._id);
      } else {
        seen.add(key);
      }
    }

    if (duplicateIds.length > 0) {
      await Station.deleteMany({ _id: { $in: duplicateIds } });
    }

    return res.status(200).json({ message: `Removed ${duplicateIds.length} duplicate stations.` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;