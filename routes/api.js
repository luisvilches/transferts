const router = require('express').Router();
const ctrl = require('../controllers');


router.post('/send',ctrl.uploadfile.upload);

module.exports = router;

