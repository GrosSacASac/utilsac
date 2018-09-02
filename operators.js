/* operators.js
Exports common operands as functions
useful when working with Ramda and functions chaining
*/

export default {
    '+': function (a, b) {
        return a + b;
    },
    '-': function (a, b) {
        return a - b;
    },
    '*': function (a, b) {
        return a * b;
    },
    '/': function (a, b) {
        return a / b;
    },
    '**': function (a, b) {
        return Math.pow(a, b);
    },
    '===': function (a, b) {
        return a === b;
    },
};
