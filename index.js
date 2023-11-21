const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory data
let users = {};
let rewards = {};

// Helper function to generate rewards for a given week
function generateRewards(userId, startDate) {
  const generatedRewards = [];
  const startOfWeek = new Date(startDate);
  startOfWeek.setUTCHours(0, 0, 0, 0);

  // Find the Sunday of the current week
  const sunday = new Date(startOfWeek);
  sunday.setUTCDate(startOfWeek.getUTCDate() - startOfWeek.getUTCDay());

  for (let i = 0; i < 7; i++) {
    const availableAt = new Date(sunday);
    availableAt.setUTCDate(sunday.getUTCDate() + i);

    const expiresAt = new Date(availableAt);
    expiresAt.setUTCDate(expiresAt.getUTCDate() + 1);

    const rewardId = availableAt.toISOString().split('.')[0]+"Z";
    const reward = {
      availableAt: availableAt.toISOString().split('.')[0]+"Z",
      redeemedAt: null,
      expiresAt: expiresAt.toISOString().split('.')[0]+"Z",
    };

    generatedRewards.push(reward);
    rewards[`${userId}-${rewardId}`] = reward;
  }

  return generatedRewards;
}

// Route to get rewards for a user at a specific date
app.get('/users/:userId/rewards', (req, res) => {
  const userId = req.params.userId;
  const date = req.query.at;

  // Check if the user exists, if not, create a new user
  if (!users[userId]) {
    users[userId] = { id: userId };
  }

  // Check if rewards for the specified date and user already exist
  if (!rewards[`${userId}-${date}`]) {
    // If not, generate rewards for the user and date
    const generatedRewards = generateRewards(userId, date);
    res.json({ data: generatedRewards });
  } else {
    // If rewards already exist, return them
    res.json({ data: [rewards[`${userId}-${date}`]] });
  }
});

// Route to redeem a reward
app.patch('/users/:userId/rewards/:availableAt/redeem', (req, res) => {
    const userId = req.params.userId;
    const availableAt = req.params.availableAt;
  
    // Find the reward based on userId and availableAt
    const reward = rewards[`${userId}-${availableAt}`];
  
    // Check if the reward exists
    if (!reward) {
      res.status(404).json({ error: { message: 'Reward not found' } });
      return;
    }
  
    const currentTime = new Date();
  
    // Check if the reward has not expired
    if (currentTime <= new Date(reward.expiresAt)) {
      // If not expired, set redeemedAt to the current time
      reward.redeemedAt = currentTime.toISOString();
      res.json({ data: reward });
    } else {
      // If expired, return an error
      res.status(400).json({ error: { message: 'This reward is already expired' } });
    }
  });
  

  module.exports = app;
