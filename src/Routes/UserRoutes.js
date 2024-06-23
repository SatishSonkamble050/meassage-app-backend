const express = require('express');


const router = express.Router()
const auth = require('./../Middleware/auth')
const userController = require('./../Controller/UserController')
const cors = require('cors')
router.use(cors())

router.use(express.json())
const verifyJWT = require('./../Middleware/auth')

// Register user -------------
router.post('/user-register', userController.userRegister)

// User login Route ----------------

router.post('/user-login', userController.userLogin)

// get all users -------------
router.get('/all', userController.getAllUser)

// get single user by token ----------------
router.get('/single', verifyJWT, userController.getSingleUser)


module.exports = router;