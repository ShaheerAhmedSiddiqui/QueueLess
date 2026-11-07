const express = require("express");
const {home, about} = require("../controllers/pageController");
const router = express.Router();

router.get('/', home);
router.get("/about", about);


export default router;
