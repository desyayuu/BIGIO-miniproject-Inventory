const request = require('supertest');
const app = require('../app');
const server = require('../app');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const authController = require('../controllers/authController');

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash('desy26', 10);
  await User.create({
    username: 'desy',
    password: hashedPassword
  });
});

afterAll(async () => {
  await User.destroy({ where: { username: 'desy' } });

  if (server && server.close) {
    await new Promise((resolve) => server.close(resolve));
  }
});

describe('POST /auths/login', () => {
  test('should respond with 404 if user is not found', async () => {
    const response = await request(app)
      .post('/auths/login')
      .send({ username: 'nonExistentUsername', password: 'somePassword' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  test('should respond with "Invalid password" message if invalid password is provided', async () => {
    const response = await request(app)
      .post('/auths/login')
      .send({ username: 'desy', password: 'somePassword' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Invalid password');
  });

  test('should respond with access token when valid credentials are provided', async () => {
    const response = await request(app)
      .post('/auths/login')
      .send({ username: 'desy', password: 'desy26' });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
  });

  test('should respond with "Internal Server Error" message if an error occurs', async () => {
    const req = { body: { username: 'testuser', password: 'password123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Mock error'));
    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('POST /auths/logout', () => {
  test('should respond with "Logout successful" message', async () => {
    const response = await request(app)
      .post('/auths/logout');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logout successful');
  });
});
