const fs = require('fs/promises');
const path = require('path');
const rewardService = require('../services/rewardService');

beforeEach(async () => {
  // Ensure a clean state before each test
  rewardService.getRewards = {};
});

it('should load rewards from a JSON file', async () => {
  await rewardService.loadRewards();
  expect(rewardService.getRewards).toEqual(expect.any(Object));
});

it('should save rewards to a JSON file', async () => {
  const filePath = path.join(__dirname, '../rewards.json');

  await rewardService.saveRewards();

  // Read the saved JSON file and assert its content
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const savedRewards = JSON.parse(fileContent);

  expect(savedRewards).toEqual(expect.any(Object));
});

it('should generate rewards for a user', () => {
  const userId = '1';
  const startDate = '2020-01-01';
  const generatedRewards = rewardService.generateRewards(userId, startDate);
  expect(generatedRewards).toEqual(expect.any(Array));
  expect(generatedRewards).toHaveLength(7); // Assuming one week of rewards
});
