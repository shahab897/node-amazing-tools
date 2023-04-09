const PORT = process.env.PORT || 3000;
const express = require('express');
const pdfTextExtract = require('pdf-text-extract');
const officegen = require('officegen');
const fs = require('fs');
const bodyParser = require('body-parser');
const FeedParser = require('feedparser');
const request = require('request');
const options = { layout: 'raw' };
const app = express();
app.use(bodyParser.json());

const dbFilePath = './urls.json';

if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, '{}');
}

const db = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));


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
// Define a function to generate a random password of a specified length and type
function generatePassword(length, type) {
    let password = '';
    let characters = '';
    if (type === 'numeric') {
        characters = '0123456789';
    } else if (type === 'uppercase') {
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    } else if (type === 'lowercase') {
        characters = 'abcdefghijklmnopqrstuvwxyz';
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

app.post('/api/rss', async function (req, res) {
    const feedUrl = req.body.feedUrl;
    if (!feedUrl) {
        res.status(400).send('Missing feedUrl parameter');
        return;
    }

    const feedReq = request(feedUrl);
    const feedparser = new FeedParser();

    feedReq.on('error', err => res.status(500).send(err));
    feedparser.on('error', err => res.status(500).send(err));

    feedReq.on('response', function (feedRes) {
        if (feedRes.statusCode !== 200) {
            res.status(500).send(`Error: ${feedRes.statusCode}`);
            return;
        }
        feedRes.pipe(feedparser);
    });

    const items = [];
    feedparser.on('readable', function () {
        const stream = this;
        let item;

        while (item = stream.read()) {
            items.push({
                title: item.title,
                link: item.link,
                pubdate: item.pubdate
            });
        }
    });

    feedparser.on('end', function () {
        res.json(items);
    });
});

function generateShortUrl() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let shortUrl = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        shortUrl += chars[randomIndex];
    }

    return shortUrl;
}

app.post('/api/shortenurl', function (req, res) {
    const longUrl = req.body.longUrl;
    // use this code to get baseurl when in production
    // const baseUrl = req.protocol + '://' + req.hostname + req.baseUrl;

    if (!longUrl) {
        res.status(400).send('Missing longUrl parameter');
        return;
    }

    let shortUrl;
    do {
        shortUrl = generateShortUrl();
    } while (db[shortUrl]);

    db[shortUrl] = longUrl;
    fs.writeFileSync(dbFilePath, JSON.stringify(db));

    res.json({ shortUrl: `http://localhost:${PORT}/${shortUrl}` });
});

app.get('/:shortUrl', function (req, res) {
    const longUrl = db[req.params.shortUrl];

    if (!longUrl) {
        res.status(404).send('Short URL not found');
        return;
    }

    res.redirect(longUrl);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});






