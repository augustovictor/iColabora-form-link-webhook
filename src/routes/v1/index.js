const express        = require('express');
const multer         = require('multer')();
const router         = express.Router();

const formController = require('../../controllers/form');
const { auth }       = require('../middlewares/auth');

router.use(auth);
router.get('/', formController.root);
router.get('/form/:token', formController.getForm);
router.post('/submit-form', multer.any(), formController.submitForm);
router.post('/send-email', formController.sendEmail);

module.exports = router;
