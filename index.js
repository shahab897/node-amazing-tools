const pdfTextExtract = require('pdf-text-extract');
const officegen = require('officegen');
const fs = require('fs');
const options = { layout: 'raw' };

pdfTextExtract.extract('path/to/pdf', options, function (err, pages) {
    if (err) {
        console.dir(err)
        return
    }
    pages.forEach(function (page) {
        console.log(page)
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