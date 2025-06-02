const express = require('express');
const { getChat, sendMessage } = require('../controllers/chatController');

const router = express.Router();

router.post('/getChat', getChat);
router.post('/sendMessage', sendMessage);

module.exports = router;

