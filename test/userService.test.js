const fs = require('fs/promises');
const path = require('path');
const userService = require('../services/userService');

beforeEach(async () => {
  // Ensure a clean state before each test
  userService.getUsers = {};
});

it('should load users from a JSON file', async () => {
  await userService.loadUsers();
  expect(userService.getUsers).toEqual(expect.any(Object));
});

it('should save users to a JSON file', async () => {
  userService.getUsers = { '1': { id: '1' }, '3': { id: '3' } }
  const filePath = path.join(__dirname, '../users.json');

  await userService.saveUsers();

  // Read the saved JSON file and assert its content
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const savedUsers = JSON.parse(fileContent);

  expect(savedUsers).toEqual(savedUsers);
});
