const childController = require('../controllers/childController');
const Router = require('express');
const router = Router();

router.post('/addChild', childController.addChild);
router.get('/getAllChildren/:parentID', childController.getAllChildren);
router.get('/getChildDetails/:parentID/:childUsername', childController.getAllChildren);
router.post('/addPhoneNumber/:childID', childController.addPhoneNumber);
router.put('/removePhoneNumber/:childID', childController.removePhoneNumber);

module.exports = router;