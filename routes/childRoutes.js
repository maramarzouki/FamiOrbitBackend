const childController = require('../controllers/childController');
const Router = require('express');
const router = Router();

router.post('/addChild', childController.addChild);
router.get('/getAllChildren/:parentID', childController.getAllChildren);
router.get('/getChildDetails/:childID', childController.getChildDetails);
router.put('/addPhoneNumber/:childID', childController.addPhoneNumber);
router.put('/verifyPhoneNumber/:childID', childController.addPhoneNumber);
router.put('/removePhoneNumber/:childID', childController.removePhoneNumber);
router.delete('/deleteChild/:childID', childController.deleteChild);

module.exports = router;