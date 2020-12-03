/**
 * Checks if variable is an integer.
 *
 * Heavily based on this post:
 * https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
 *
 * Examples:
 * 12 -> true
 * '12' -> true
 * '12.6' -> false
 * 'foo' -> false
 * '12px' -> false
 * '12.' -> true
 *
 * @param {*} number
 */
exports.isInteger = function isInteger(number) {
  return !Number.isNaN(+number) && !Number.isNaN(parseInt(number, 10))
        && Number.isInteger(parseFloat(number));
};
