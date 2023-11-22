const express = require("express");
const bodyParser = require("body-parser");
const rewardService = require("./rewardService");
const userService = require("./userService");

const app = express();
app.use(bodyParser.json());


// Route to get rewards for a user at a specific date
app.get("/users/:userId/rewards", async (req, res) => {
  const userId = req.params.userId;
  const date = req.query.at;

  // Load users from the JSON file
  await userService.loadUsers();

  // Check if the user exists, if not, create a new user
  if (!userService.getUsers()[userId]) {
    userService.getUsers()[userId] = { id: userId };

    // Save users after creating a new user
    await userService.saveUsers();
  }

  // Load rewards from the JSON file
  rewardService.loadRewards();

  // Check if rewards for the specified date and user already exist
  if (!rewardService.getRewards()[`${userId}-${date}`]) {
    // If not, generate rewards for the user and date
    const generatedRewards = rewardService.generateRewards(userId, date);
    res.json({ data: generatedRewards });
  } else {
    // If rewards already exist, return them
    res.json({ data: [rewards[`${userId}-${date}`]] });
  }
});

// Route to redeem a reward
app.patch("/users/:userId/rewards/:availableAt/redeem", async (req, res) => {
  const userId = req.params.userId;
  const availableAt = req.params.availableAt;

  // Load users from the JSON file
  await userService.loadUsers();

  // Load rewards
  await rewardService.loadRewards();

  // Find the reward based on userId and availableAt
  const reward = rewardService.getRewards()[`${userId}-${availableAt}`];

  // Check if the reward exists
  if (!reward) {
    res.status(404).json({ error: { message: "Reward not found" } });
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
    res
      .status(400)
      .json({ error: { message: "This reward is already expired" } });
  }

  // Save rewards after redeeming
  await rewardService.saveRewards();
});

module.exports = app;
