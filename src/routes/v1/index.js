const express        = require('express');
const router         = express.Router();

const formController = require('../../controllers/form');

router.get('/', formController.root);
router.get('/form/:id', formController.getForm);
router.post('/new-form', formController.newForm);
router.post('/submit-form', formController.submitForm);

module.exports = router;