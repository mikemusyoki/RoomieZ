const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/Questionnaire');
const Profile = require('../models/Profile');
const Match = require('../models/Match');
const { computeCompatibility } = require('../utils/matcher');
const auth = require('../middleware/auth');

// GET /api/matches - Retrieve a ranked list of compatible roommates
router.get('/', auth, async (req, res) => {
  try {
    const myId = req.user.userId;

    // 1. Fetch the current user's data
    const myData = await Questionnaire.findOne({ userId: myId });
    const myProfile = await Profile.findOne({ userId: myId });

    if (!myData || !myProfile) {
      return res.status(400).json({ 
        error: "Please complete your profile and questionnaire before viewing matches." 
      });
    }

    // 2. Fetch all other users' data
    const otherQuestionnaires = await Questionnaire.find({ userId: { $ne: myId } }).populate('userId', '-passwordHash');
    const allOtherProfiles = await Profile.find({ userId: { $ne: myId } });

    // 3. Fetch all match records involving this user
    const myMatches = await Match.find({ users: myId });

    // 4. Calculate scores for each potential match
    const results = otherQuestionnaires.map(otherQuest => {
      const otherProf = allOtherProfiles.find(p => p.userId.toString() === otherQuest.userId._id.toString());
      if (!otherProf) return null;

      const userA = { ...myData._doc, ...myProfile._doc };
      const userB = { ...otherQuest._doc, ...otherProf._doc };

      // Find match record between these two users
      const matchRecord = myMatches.find(m => 
        m.users.some(u => u.toString() === otherQuest.userId._id.toString())
      );

      const iLiked = matchRecord ? matchRecord.likes.some(l => l.toString() === myId) : false;
      const theyLiked = matchRecord ? matchRecord.likes.some(l => l.toString() === otherQuest.userId._id.toString()) : false;
      const matchStatus = matchRecord ? matchRecord.status : 'none';
      const matchId = matchRecord ? matchRecord._id : null;

      return {
        user: otherQuest.userId,
        profile: otherProf,
        compatibility: computeCompatibility(userA, userB),
        iLiked,
        theyLiked,
        matchStatus,
        matchId,
      };
    }).filter(match => match !== null);

    // 5. Rank by compatibility and return results
    const rankedMatches = results
      .filter(m => m.compatibility >= 40)
      .sort((a, b) => b.compatibility - a.compatibility);

    res.json({
      success: true,
      count: rankedMatches.length,
      matches: rankedMatches
    });

  } catch (err) {
    console.error('Matching Error:', err);
    res.status(500).json({ error: "Internal Server Error - Matching engine failed." });
  }
});

module.exports = router;