const pdfTextExtract = require('pdf-text-extract');
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