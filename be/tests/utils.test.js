const utils = require('../src/utils');

describe('isInteger Test', () => {
  it('should state that 12 is an integer', () => {
    expect(utils.isInteger(12)).toBe(true);
  });

  it('should state that \'12\' is an integer', () => {
    expect(utils.isInteger('12')).toBe(true);
  });

  it('should state that \'12.6\' is NOT an integer', () => {
    expect(utils.isInteger('12.6')).toBe(false);
  });

  it('should state that \'foo\' is NOT an integer', () => {
    expect(utils.isInteger('foo')).toBe(false);
  });

  it('should state that \'12px\' is NOT an integer', () => {
    expect(utils.isInteger('12px')).toBe(false);
  });

  it('should state that \'12.\' is an integer', () => {
    expect(utils.isInteger('12.')).toBe(true);
  });
});
