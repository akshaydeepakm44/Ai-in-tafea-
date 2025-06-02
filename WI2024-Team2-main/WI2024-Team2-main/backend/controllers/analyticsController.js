const { Lesson, Activity, Class } = require('../models/model'); // Ensure Class is imported
const jwt = require('jsonwebtoken');

const getAnalyticsData = async (req, res) => {
  try {
    const { token } = req.query;
    const mailId = jwt.verify(token, process.env.JWT_SECRET).mail;

    if (!mailId) {
      return res.status(400).json({ message: 'Mail ID is required.' });
    }

    const lessons = await Lesson.find({ mailId }).populate('selectedActivityId');
    const classes = await Class.find({}); // Fetch all classes (or filter as needed)

    const skillDistribution = [];
    const classPerformance = [];
    const classDates = [];

    lessons.forEach(lesson => {
      const activity = lesson.selectedActivityId;
      if (activity) {
        classDates.push(new Date(lesson.createdAt).toLocaleDateString());
        classPerformance.push(activity.averageScore);

        activity.skills.forEach(skill => {
          const skillIndex = skillDistribution.findIndex(s => s.name === skill.name);
          if (skillIndex === -1) {
            skillDistribution.push({ name: skill.name, scores: [skill.score] });
          } else {
            skillDistribution[skillIndex].scores.push(skill.score);
          }
        });
      }
    });

    console.log('Returning analytics data:', { classes, skillDistribution, classPerformance, classDates }); // Debug log
    res.status(200).json({ classes, skillDistribution, classPerformance, classDates });
  } catch (error) {
    console.error('Error fetching analytics data:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { getAnalyticsData };
