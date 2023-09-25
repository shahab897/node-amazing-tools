const express = require('express');
const router = express.Router();

router.get('/:length', (req, res) => {
    //add check to limit max length
    const length = parseInt(req.params.length);
    const password = generatePassword(length);
    res.json({ password: password });
});

router.post('/', (req, res) => {
    const length = parseInt(req.body.length);
    const type = req.body.type;
    const password = generatePassword(length, type);
    res.json({ password: password });
});
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

module.exports = router;