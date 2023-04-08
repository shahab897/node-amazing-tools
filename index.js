const express = require('express');
const pdfTextExtract = require('pdf-text-extract');
const officegen = require('officegen');
const fs = require('fs');
const bodyParser = require('body-parser');
const options = { layout: 'raw' };

const app = express();
app.use(bodyParser.json());

app.post('/api/convert', (req, res) => {
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
function generatePassword(length, type = '') {
    let password = '';
    let characters = '';
    if (type === 'numeric') {
        characters = '0123456789';
    } else if (type === 'alphabetic') {
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    } else {
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    }
    for (let i = 0; i < length; i++) {
        // Generate a random index into the characters array
        const index = Math.floor(Math.random() * characters.length);
        // Add the character at that index to the password
        password += characters[index];
    }
    return password;
}
//Get Call to generate Mix Password
app.get('/api/password/:length', (req, res) => {
    const length = parseInt(req.params.length);
    const password = generatePassword(length);
    res.json({ password: password });
});

//Post Call to generate Password by giving type of password needed
//Types Included are numeric, alphabetic and mix of all
app.post('/api/password', (req, res) => {
    const length = parseInt(req.body.length);
    const type = req.body.type;
    const password = generatePassword(length, type);
    res.json({ password: password });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});






