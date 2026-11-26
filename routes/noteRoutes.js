const express = require("express");
const router = express.Router();

const {
  verifyToken
} = require("../middleware/authMiddleware");

const {
  createNote,
  getNotes,
  updateNote,
  deleteNote
} = require("../controllers/noteController");

// All routes require authentication
router.use(verifyToken);

router.get("/", getNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;