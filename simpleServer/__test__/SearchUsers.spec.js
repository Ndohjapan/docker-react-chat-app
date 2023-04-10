const app = require('../src/app');
const request = require('supertest');
const { UserSchema } = require('../src/models/User');
const en = require('../locales/en/transalation');
const mongoose = require('mongoose');

let validUser;

beforeEach(async () => {
  await mongoose.connect('mongodb://localhost:27017/test3', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  validUser = {
    displayName: 'Ndohjapan',
    email: 'ndohjoelmbj16@gmail.com',
    photoURL: 'Chibueze17',
    uid: '32ri329j9032uifm32',
  };
});

afterEach(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch (error) {
    return true;
  }
});

const searchUser = async (displayName = '') => {
  return request(app).get('/search').query({ displayName });
};

describe('Search for use rby display name', () => {
  it.each`
    invalidUser
    ${''}
    ${'Ndoh'}
    ${'jay'}
  `(
    'returns 404 response code when wrong user is searched for',
    async ({ invalidUser }) => {
      await UserSchema.create(validUser);

      const response = await searchUser(invalidUser);

      expect(response.status).toBe(404);
    }
  );

  it.each`
    invalidUser
    ${''}
    ${'Ndoh'}
    ${'jay'}
  `(
    'returns user not found when wrong user is searched for',
    async ({ invalidUser }) => {
      await UserSchema.create(validUser);

      const response = await searchUser(invalidUser);

      expect(response.body.message).toBe(en.user_not_found);
    }
  );

  it('returns 200 if the user eing searched is found in the database', async () => {
    await UserSchema.create(validUser);

    const response = await searchUser(validUser.displayName);

    expect(response.status).toBe(200);
  });

  it('ensure response body is only one field of user', async () => {
    await UserSchema.create(validUser);

    const response = await searchUser(validUser.displayName);

    expect(response.body.user.displayName).toBe(validUser.displayName);
  });
});
