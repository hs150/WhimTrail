// backend/routes/chat.js
const express = require('express');
const {
  createMessage,
  getMessagesByConversation,
  getUserConversations,
  markMessagesRead
} = require('../models/supabase/ChatMessage');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Create a new conversation
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { topic } = req.body;
    const conversationId = `conv_${Date.now()}_${req.userId}`;

    const msg = await createMessage({
      conversation_id: conversationId,
      sender_id: req.userId,
      message: topic || 'New conversation started',
      metadata: { system: true, topic: topic || 'General' }
    });

    const conversation = {
      _id: conversationId,
      topic: topic || 'General',
      status: 'open',
      messages: [msg]
    };

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat', error: error.message });
  }
});

// Get user's conversations
router.get('/user/all', verifyToken, async (req, res) => {
  try {
    const msgs = await getUserConversations(req.userId);

    const grouped = {};
    msgs.forEach(m => {
      if (!grouped[m.conversation_id]) grouped[m.conversation_id] = [];
      grouped[m.conversation_id].push(m);
    });

    const conversations = Object.keys(grouped).map(cid => ({
      _id: cid,
      topic: grouped[cid][0]?.metadata?.topic || 'General',
      status: grouped[cid][0]?.metadata?.closed ? 'closed' : 'open',
      messages: grouped[cid]
    }));

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
});

// Get specific conversation messages
router.get('/:chatId', verifyToken, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const messages = await getMessagesByConversation(chatId);

    await markMessagesRead(chatId, req.userId);

    const conversation = {
      _id: chatId,
      topic: messages[0]?.metadata?.topic || 'General',
      status: messages[0]?.metadata?.closed ? 'closed' : 'open',
      messages
    };

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat', error: error.message });
  }
});

// Send message
router.post('/:chatId/message', verifyToken, async (req, res) => {
  try {
    const { message, receiverId } = req.body;
    const chatId = req.params.chatId;

    const msg = await createMessage({
      conversation_id: chatId,
      sender_id: req.userId,
      receiver_id: receiverId || null,
      message
    });

    const messages = await getMessagesByConversation(chatId);

    const conversation = {
      _id: chatId,
      topic: messages[0]?.metadata?.topic || 'General',
      status: messages[0]?.metadata?.closed ? 'closed' : 'open',
      messages
    };

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Close conversation
router.put('/:chatId/close', verifyToken, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const msg = await createMessage({
      conversation_id: chatId,
      sender_id: req.userId,
      message: 'Conversation closed',
      metadata: { system: true, closed: true }
    });

    const messages = await getMessagesByConversation(chatId);

    const conversation = {
      _id: chatId,
      topic: messages[0]?.metadata?.topic || 'General',
      status: 'closed',
      messages
    };

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Error closing chat', error: error.message });
  }
});

module.exports = router;