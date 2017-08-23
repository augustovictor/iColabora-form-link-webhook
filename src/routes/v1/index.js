const express        = require('express');
const router         = express.Router();

const formController = require('../../controllers/form');
const { auth } = require('../middlewares/auth');

router.use(auth);
router.get('/', formController.root);
router.get('/form/:token', formController.getForm);
router.post('/new-form', formController.newForm);
router.post('/submit-form', formController.submitForm);
router.post('/send-email', formController.sendEmail);
router.post('/turbina-form', formController.getTurbinaForm);

module.exports = router;