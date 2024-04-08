module.exports = {
    //collectCoverageFrom: ['**/*.[jt]s?(x)', '!**/*.stories.[jt]s?(x)'],
    collectCoverageFrom: ['src/*.js', '!src/_*.js'],
    testMatch: ['<rootDir>/test/*.js', '!<rootDir>/test/**/_*.js'],
    // testEnvironment: "@bufbuild/jest-environment-jsdom",
    /*
    coverageThreshold: {
        './src/': {
          statements: 95,
          branches: 90,
          functions: 95,
          lines: 90,
        },
      },
    */
};