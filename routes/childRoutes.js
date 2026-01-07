const childController = require('../controllers/childController');
const Router = require('express');
const router = Router();

router.post('/addChild/:parentID', childController.addChild);
router.post('/addPhoneNumber/:childID', childController.addPhoneNumber);
router.put('/removePhoneNumber/:childID', childController.removePhoneNumber);

module.exports = router;