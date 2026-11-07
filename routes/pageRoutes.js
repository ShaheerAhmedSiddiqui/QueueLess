const express = require("express");
const {home, about, contact, login} = require("../controllers/pageController");
const router = express.Router();

router.get('/', home);
router.get("/about", about);
router.get("/contact", contact);
router.get("/login", login);



export default router;
