const request = require('supertest');
const app = require('./index.js'); // assuming your app file is named app.js

describe('Reward API Tests', () => {
  it('should generate rewards for a user on a specific date', async () => {
    const response = await request(app)
      .get('/users/1/rewards')
      .query({ at: '2023-11-29T12:00:00Z' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveLength(7);
  });

  it('should redeem a reward successfully', async () => {

    const response = await request(app)
      .patch('/users/1/rewards/2023-11-29T00:00:00Z/redeem')
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('redeemedAt');
  });

  it('should return 404 for non-existing reward', async () => {
    const response = await request(app)
      .patch('/users/1/rewards/2020-03-20T00:00:00Z/redeem')
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error.message).toBe('Reward not found');
  });

  it('should return 400 for redeeming an expired reward', async () => {

    // Generate reward for user earlier than current date
    const newUser = await request(app)
      .get('/users/3/rewards')
      .query({ at: '2020-03-19T12:00:00Z' });

      expect(newUser.status).toBe(200);

    // Assuming the current date is later than the expiry of the reward
    const response = await request(app)
      .patch('/users/3/rewards/2020-03-20T00:00:00Z/redeem')
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error.message).toBe('This reward is already expired');
  });
});
