export {
    randomInt
};

/**
Returns a random integer between 0 (included) and
maxExlusive (excluded)

@param {int} maxExclusive

@return {int} random integer
*/
const randomInt = function (maxExclusive = 2) {
    return Math.floor(Math.random() * maxExclusive);
};
