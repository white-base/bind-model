


// import * as user from '../user';




// The assertion for a promise must be returned.
it('works with promises', () => {
  jest.mock('./request')
  const user = require('./user')
  expect.assertions(1);
  // return user.getUserName(4).then(data => expect(data).toBe('Mark'));
  return expect(user.getUserName(5)).resolves.toBe('Paul');
});