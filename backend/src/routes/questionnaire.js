const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Questionnaire = require('../models/Questionnaire');

// Create or Update Questionnaire
router.post('/', auth, async (req, res) => {
  try {
    const {
      cleanliness,
      sleepSchedule,
      socialLevel,
      noiseTolerance,
      studyEnvironment,
      sharingPolicy,
      smoking,
      introversion
    } = req.body;

    // Validate all fields are present
    if (!cleanliness || !sleepSchedule || !socialLevel || !noiseTolerance ||
        !studyEnvironment || !sharingPolicy || smoking === undefined || !introversion) {
      return res.status(400).json({ error: 'All questionnaire fields are required' });
    }

    // Check if questionnaire already exists for this user
    let questionnaire = await Questionnaire.findOne({ userId: req.user.userId });

    if (questionnaire) {
      // Update existing
      questionnaire.cleanliness = cleanliness;
      questionnaire.sleepSchedule = sleepSchedule;
      questionnaire.socialLevel = socialLevel;
      questionnaire.noiseTolerance = noiseTolerance;
      questionnaire.studyEnvironment = studyEnvironment;
      questionnaire.sharingPolicy = sharingPolicy;
      questionnaire.smoking = smoking;
      questionnaire.introversion = introversion;
      questionnaire.updatedAt = Date.now();
      await questionnaire.save();
    } else {
      // Create new
      questionnaire = new Questionnaire({
        userId: req.user.userId,
        cleanliness,
        sleepSchedule,
        socialLevel,
        noiseTolerance,
        studyEnvironment,
        sharingPolicy,
        smoking,
        introversion
      });
      await questionnaire.save();
    }

    res.status(201).json({
      success: true,
      message: 'Questionnaire saved successfully',
      questionnaire
    });
  } catch (err) {
    console.error('Questionnaire Error:', err);
    res.status(500).json({ error: 'Failed to save questionnaire' });
  }
});

// Get user's questionnaire
router.get('/', auth, async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findOne({ userId: req.user.userId });
    
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    res.json(questionnaire);
  } catch (err) {
    console.error('Questionnaire Retrieval Error:', err);
    res.status(500).json({ error: 'Failed to retrieve questionnaire' });
  }
});

module.exports = router;
