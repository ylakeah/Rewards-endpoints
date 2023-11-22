const fs = require("fs/promises"); // Using promises version for async/await

let rewards = {};

// Load rewards from JSON file on startup
async function loadRewards() {
  try {
    const data = await fs.readFile("./rewards.json", "utf8");
    rewards = JSON.parse(data);
  } catch (error) {
    console.error("Error loading rewards:", error.message);
  }
}

// Save rewards to JSON file
async function saveRewards() {
  try {
    await fs.writeFile(
      "rewards.json",
      JSON.stringify(rewards, null, 2),
      "utf8"
    );
  } catch (error) {
    console.error("Error saving rewards:", error.message);
  }
}

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

    const rewardId = availableAt.toISOString().split(".")[0] + "Z";
    const reward = {
      availableAt: availableAt.toISOString().split(".")[0] + "Z",
      redeemedAt: null,
      expiresAt: expiresAt.toISOString().split(".")[0] + "Z",
    };

    generatedRewards.push(reward);
    rewards[`${userId}-${rewardId}`] = reward;
  }

  // Save rewards after generating
  saveRewards();

  return generatedRewards;
}

// Adding a function to get a promise for loading rewards
function loadRewardsPromise() {
  return loadRewards().then(() => rewards);
}

const rewardService = {
  getRewards: () => rewards,
  loadRewards,
  saveRewards,
  generateRewards,
  loadRewardsPromise,
};

module.exports = rewardService;
