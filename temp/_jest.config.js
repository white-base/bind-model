export default {
  collectCoverageFrom: ['src/*.js', '!src/_*.js'],
  projects: [
    {
      displayName: "CommonJS",
      testEnvironment: "node",
      testMatch: ["**/test/*.test.cjs"],
      transform: {},
    },
    {
      displayName: "ES Module",
      testEnvironment: "node",
      testMatch: ["**/test/*.test.js", "**/test/*.test.mjs"],
      // transform: {},
      // transform: {
      //   '^.+\\.js$': 'babel-jest',
      // }
    },
    {
      displayName: "Browser",
      testEnvironment: "jsdom",
      testMatch: ["**/test/*.test.browser.js", "**/test/*.test.browser.cjs"],
    },
  ],
};