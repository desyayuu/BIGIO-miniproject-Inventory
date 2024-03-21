const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

describe('POST /auths/login', () => {
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('desy26', 10);
    await User.create({
      username: 'desy',
      password: hashedPassword
    });
  });

  afterAll(async () => {
    await User.destroy({ where: { username: 'desy' } });
  });

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

  test('should respond with "Internal Server Error" if an error occurs', async () => {
    jest.spyOn(User, 'findOne').mockImplementation(() => {
      throw new Error('Database connection failed');
    });

    const response = await request(app)
      .post('/auths/login')
      .send({ username: 'desy', password: 'desy26' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');

    User.findOne.mockRestore();
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