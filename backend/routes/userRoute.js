import express from "express";
import { register, verify, reverify, login, logout, forgotPassword, verifyOtp, resetPassword, allUser, getUserById } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
const router=express.Router();

router.post('/register',register)
router.post('/verify',verify)
router.post('/reVerify',reverify)
router.post('/login',login)
router.post('/logout',isAuthenticated,logout)
router.post('/forgotPassword',forgotPassword)
router.post('/verifyOtp',verifyOtp)
router.post('/resetPassword',isAuthenticated,resetPassword)
router.get('/allUser',allUser)
router.get('/getUser/:userId',getUserById)

export default router;