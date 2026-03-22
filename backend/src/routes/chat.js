const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// Get all messages for a specific match
router.get('/:matchId', auth, async (req, res) => {
  try {
    // Security check: The matchId is a deterministic string "userId1_userId2"
    // Verify the requesting user is one of the two participants
    const participants = req.params.matchId.split('_');
    if (!participants.includes(req.user.userId)) {
      return res.status(403).json({ error: "Unauthorized access to chat" });
    }

    const messages = await Message.find({ matchId: req.params.matchId })
      .sort({ createdAt: 1 }); // Oldest first
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Could not retrieve messages" });
  }
});

module.exports = router;