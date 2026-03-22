const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Profile = require('../models/Profile');
const Match = require('../models/Match');
const Message = require('../models/Message');
const Questionnaire = require('../models/Questionnaire');

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [users, matches, messages, questionnaires] = await Promise.all([
      User.countDocuments(),
      Match.countDocuments(),
      Message.countDocuments(),
      Questionnaire.countDocuments(),
    ]);
    res.json({ users, matches, messages, questionnaires });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    const profiles = await Profile.find();
    const questionnaires = await Questionnaire.find();

    const enriched = users.map(user => {
      const profile = profiles.find(p => p.userId.toString() === user._id.toString());
      const questionnaire = questionnaires.find(q => q.userId.toString() === user._id.toString());
      return {
        _id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        profile: profile || null,
        hasQuestionnaire: !!questionnaire,
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/admin/matches
router.get('/matches', async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('users', 'email')
      .populate('likes', 'email')
      .sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// GET /api/admin/messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('senderId', 'email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
