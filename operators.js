// operators.js
/*
Exports common operands as functions
useful when working with Ramda and functions chaining
*/
// Also look at the Reflect API
export default (function () {
    "use strict";
    return {
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
}());
