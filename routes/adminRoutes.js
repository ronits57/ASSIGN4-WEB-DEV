const express = require("express");
const router = express.Router();
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");
const { getAllUsers } = require("../controllers/adminController");

router.get("/users", verifyToken, allowRoles("admin"), getAllUsers);

module.exports = router;
