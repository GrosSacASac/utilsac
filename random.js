export {
    randomPositiveInt,
    randomInt,
    randomFloat
};

/**
Returns a random integer between 0 (included) and
maxExlusive (excluded)

@param {uint} maxExclusive

@return {uint} random positive integer
*/
const randomPositiveInt = function (maxExclusive = 2) {
    return Math.floor(Math.random() * maxExclusive);
};

/**
Returns a random integer between minInclusive (included) and
maxExlusive (excluded)

@param {int} maxExclusive
@param {int} maxExclusive

@return {int} random integer
*/
const randomInt = function (minInclusive = 0, maxExclusive = 2) {
    return minInclusive + Math.floor(Math.random() * (maxExclusive - minInclusive));
};

/**
Returns a random number between minInclusive (included) and
maxExlusive (excluded)

@param {number} maxExclusive
@param {number} maxExclusive

@return {number} random number
*/
const randomFloat = function (minInclusive = 0, maxExclusive = 1) {
  return minInclusive + (Math.random() * (maxExclusive - minInclusive));
};
