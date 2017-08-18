const express        = require('express');
const router         = express.Router();

const { getFile } = require('../../helpers');

router.get('/', (req, res) => {
    res.end();
});

router.get('/sample/:name', (req, res) => {
    Promise.all([
        getFile('/turbina/form-satisfaction.html'),
        getFile('/turbina/footer.html')
    ]).then(files => {
        const params = {
            client: 'SKY',
            customerId: '123',
            customerName: 'Victor Augusto',
            html: files.map(file => file.toString())
        };

        res.render('sample', { params });
    })
    .catch(err => {
        res.send(err);
    });
});

router.post('/submit-form', (req, res) => {
    console.log('Received!');
    console.log(req.body);
    res.sendStatus(200);
    res.end();
});

module.exports = router;