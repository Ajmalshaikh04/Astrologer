const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getAstrologers,
  getAstrologer,
  createAstrologer,
  createAstrologerWithAccount,
  updateAstrologer,
  deleteAstrologer,
  getAstrologersBySpecialty,
  getTopRatedAstrologers,
  toggleAstrologerAvailability,
  getAstrologerTodayStats,
  enableDisableChat,
  enableDisableCall,
  getAstrologerCharges,
  getAstrologerUsingToken,
  updateAstrologerUsingToken
} = require("../controllers/astrologerController");

// Public routes
router.get("/", getAstrologers);
router.get("/top-rated", getTopRatedAstrologers);
router.get('/today-stats', protect ,authorize('astrologer'), getAstrologerTodayStats);
// Route to get charge per minute for chat and call
router.get('/charges', protect, authorize('astrologer'), getAstrologerCharges);
router.get("/get-astrologer", protect, authorize("astrologer"), getAstrologerUsingToken);
router.put("/update-astrologer", protect, authorize("astrologer"), updateAstrologerUsingToken);
router.get("/:id", getAstrologer);
router.get("/specialty/:categoryId", getAstrologersBySpecialty);
// router.get("/top-rated", getTopRatedAstrologers);




// Route to enable/disable chat
router.put('/enable-disable-chat', protect, authorize('astrologer'), enableDisableChat);

// Route to enable/disable call
router.put('/enable-disable-call', protect, authorize('astrologer'), enableDisableCall);
// Admin only routes
// router.post("/", authorize("admin"), createAstrologer);
router.post("/create",protect, authorize("admin"), createAstrologerWithAccount);
router.put("/:id", protect,authorize("admin"), updateAstrologer);
router.delete("/:id", protect,authorize("admin"), deleteAstrologer);

// Astrologer only routes
router.put(
  "/:id/toggle-availability",
  authorize("astrologer"),
  toggleAstrologerAvailability
);

module.exports = router;
