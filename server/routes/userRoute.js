import express from "express";
import { register, verify, reverify, login, logout, forgotPassword, verifyOtp, resetPassword, allUser, getUserById, uploadProfilePic, updateProfile, deleteAccount, getMe } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";
const router=express.Router();

router.post('/register',register)
router.post('/verify',verify)
router.post('/reVerify',reverify)
router.post('/login',login)
router.post('/logout',isAuthenticated,logout)
router.post('/forgotPassword',forgotPassword)
router.post('/verifyOtp',verifyOtp)
router.post('/resetPassword',isAuthenticated,resetPassword)
router.post('/uploadProfilePic', isAuthenticated, upload.single('profilePic'), uploadProfilePic)
router.get('/allUser',allUser)
router.get('/getUser/:id',getUserById)
router.get('/me', isAuthenticated, getMe)
router.put('/updateProfile', isAuthenticated, updateProfile)
router.delete('/deleteAccount', isAuthenticated, deleteAccount)

export default router;