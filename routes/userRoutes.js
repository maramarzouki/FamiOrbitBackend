const userController = require('../controllers/userController')
const Router = require('express');

const router = Router();

router.post('/registerUser', userController.createAccount);
router.post('/login', userController.login);
router.post('/sendResetPasswordCode', userController.sendResetPasswordCode);
router.post('/verifyResetPasswordCode', userController.verifyResetPasswordCode);
router.put('/resetPassword', userController.resetPassword);

module.exports = router;