const express        = require('express');
const router         = express.Router();

const formController = require('../../controllers/form');

router.get('/', formController.root);
router.get('/form/:token', formController.getForm);
router.post('/new-form', formController.newForm);
router.post('/submit-form', formController.submitForm);
router.post('/send-email', formController.sendEmail);

module.exports = router;