const fs = require('fs/promises');

let users = {};

async function loadUsers() {
  try {
    const data = await fs.readFile('users.json', 'utf-8');
    users = JSON.parse(data);
  } catch (error) {
    // Handle errors as needed
    console.error('Error loading users:', error);
  }
}

async function saveUsers() {
  try {
    await fs.writeFile('users.json', JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    // Handle errors as needed
    console.error('Error saving users:', error);
  }
}

// Singleton pattern to manage state
const userService = {
  getUsers: () => users,
  loadUsers,
  saveUsers,
};

module.exports = userService;
