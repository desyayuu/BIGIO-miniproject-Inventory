const request = require('supertest');
const app = require('../app');

jest.mock('../routes/authRoutes', () => require('../mock/authRoutes.test.mock'));

describe('POST /auths/login', () => {
  test('should respond with access token when valid credentials are provided', async () => {
    const response = await request(app)
      .post('/auths/login')
      .send({ username: 'capek', password: 'capek26' });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
  });

  test('should respond with 404 if user is not found', async () => {
    const response = await request(app)
      .post('/auths/login')
      .send({ username: 'nonExistentUsername', password: 'somePassword' });

    expect(response.status).toBe(404);
  });

  test('should respond with 401 if invalid password is provided', async () => {
    const response = await request(app)
      .post('/auths/login')
      .send({ username: 'capek', password: 'capek6' });

    expect(response.status).toBe(401);
  });

  
});
