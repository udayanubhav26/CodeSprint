const express = require('express');

const router = express.Router();

const { chatAi } = require('../controllers/chatAi.js');

router.post('/ai', chatAi);

module.exports = router;