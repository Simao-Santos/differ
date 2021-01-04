/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "jest",
  coverageAnalysis: "off",
  htmlReporter: {
    baseDir: './tests/reports/stryker'
  },
  files: [
    'src/**/*.js',
    'tests/*.test.js'
  ]
};
