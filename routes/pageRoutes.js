const express = require("express");
const {home, about, contact, login, register, forgotPassword} = require("../controllers/pageController");
const router = express.Router();

router.get('/', home);
router.get("/about", about);
router.get("/contact", contact);
router.get("/login", login);
router.get("/register", register);
router.get("/forgot-password", forgotPassword);
export default router;
