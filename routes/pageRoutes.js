const express = require("express");
const {home, about, contact, login, register} = require("../controllers/pageController");
const router = express.Router();

router.get('/', home);
router.get("/about", about);
router.get("/contact", contact);
router.get("/login", login);
router.get("/register", login);

module.exports = router;
