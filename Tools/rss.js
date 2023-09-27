const express = require('express');
const router = express.Router();
const FeedParser = require('feedparser');
const request = require('request');

router.post('/', async function (req, res) {
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


module.exports = router;