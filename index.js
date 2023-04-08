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

// Define an API endpoint that generates a random password
app.get('/api/password/:length', (req, res) => {
    // Parse the desired length from the URL parameter
    const length = parseInt(req.params.length);
    // Generate a random password of the desired length
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        // Generate a random index into the characters array
        const index = Math.floor(Math.random() * characters.length);
        // Add the character at that index to the password
        password += characters[index];
    }
    // Return the generated password as a JSON response
    res.json({ password: password });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});






