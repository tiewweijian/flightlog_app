// backend/routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const userController = require('../controllers/userController');
const { isAdmin } = require('../middleware/isAdmin');

const router = express.Router();

router.post('/register', [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
], userController.registerUser);


router.post('/login', [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').exists(),
], userController.loginUser);


router.get('/', isAdmin, userController.getAllUsers);
router.get('/isAdmin', isAdmin, userController.isAdmin); 
router.delete('/:id', isAdmin, userController.deleteUser);
router.get('/createAdmin', userController.createAdmin);

module.exports = router;
