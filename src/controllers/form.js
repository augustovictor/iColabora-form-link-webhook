const { getFile } = require('../helpers');

const turbinaHtml = `
<div>
    <h3>Form vindo do turbina</h3>
    <div>
        <label id="contactQualification">Nota sobre o atendimento</label>
        <input id="contactQualification" type="text" name="contactQualification" />
    </div>
</div>
`;

exports.root = (req, res) => {
    res.end();
}

exports.getForm = (req, res) => {
    Promise.all([
        getFile('/turbina/form-satisfaction.html'),
        getFile('/turbina/footer.html')
    ]).then(files => {
        const params = {
            client: 'SKY',
            customerId: '123',
            customerName: 'Victor Augusto',
            turbinaHtml: turbinaHtml,
            localHtml: files.map(file => file.toString())
        };

        res.render('sample', { params });
    })
    .catch(err => {
        res.send(err);
    });
};

exports.newForm =  (req, res) => {
    console.log('Received!');
    console.log(req.body);
    res.sendStatus(200);
    res.end();
};