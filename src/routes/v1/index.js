const express        = require('express');
const router         = express.Router();

const formController = require('../../controllers/form');

router.get('/', formController.root);
router.get('/sample/:name', formController.getForm);
router.post('/submit-form', formController.newForm);

module.exports = router;