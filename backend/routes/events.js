const express = require("express");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin can create events
router.post("/", authenticate, isAdmin, createEvent);

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById); // get single event

// Admin update + delete
router.put("/:id", authenticate, isAdmin, updateEvent);
router.delete("/:id", authenticate, isAdmin, deleteEvent);

module.exports = router;
