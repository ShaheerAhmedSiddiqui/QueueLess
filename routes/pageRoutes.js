const express = require("express");
const {home, about, contact} = require("../controllers/pageController");
const router = express.Router();

router.get('/', home);
router.get("/about", about);
router.get("/contact", contact);


export default router;
