const express = require('express');
const pdfTextExtract = require('pdf-text-extract');
const officegen = require('officegen');
const fs = require('fs');
const bodyParser = require('body-parser');
const options = { layout: 'raw' };

const app = express();
app.use(bodyParser.json());

app.post('/convert', (req, res) => {
    pdfTextExtract.extract(req.body.pdfPath, options, function (err, pages) {
        if (err) {
            res.status(500).json({ message: err });
            return
        }
        let text = '';
        pages.forEach(function (page) {
            console.log(page)
            text += page;
        });


    });
    /*simple code to add text to docx and save*/
    // Create a new Word document
    const docx = officegen('docx');

    // Set the title of the document
    docx.title('Converted PDF');

    // Add text to the document
    docx.addText('Text extracted from PDF file', { font_face: 'Arial', font_size: 14 });

    // Save the document
    const stream = fs.createWriteStream('./path/to/output.docx');
    docx.generate(stream);

    res.status(200).json({ message: 'Success' });

});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});






