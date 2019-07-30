import test from 'ava';
import { deepAssign } from '../../utility.js';


const primitives = [
    undefined,
    null,
    43,
    `x`,
];

test(`it should silently discard primitives like Object.assign`, t => {
    const result = deepAssign({}, ...primitives);

    t.is(Object.keys(result).length, 0);
});

test(`it should avoid prototype pollution`, t => {
    // mistake 1 does not declare all fields explictly (const user1 = {isAdmin: false};)

    const user1 = {};

    t.is(user1.isAdmin, undefined);

    const untrustedInput = `{
        "__proto__": {"isAdmin": true}
    }`;

    let parsedInput;
    try {
        parsedInput = JSON.parse(untrustedInput);
    } catch (parseError) {
        return;
    }

    // mistake 2 not checking if the input has too many fields
    // mistake 3 not checking if the input has too few fields
    // mistake 4 used deepAssign instead of deepCopy

    const copy = deepAssign({}, parsedInput);

    // mistake 5 defensive style, unecessary  copy, better is to have convention to not modify input in functions
    // mistake 6 copy everything, be lazy !

    t.is(user1.isAdmin, undefined);

    // recovery (only to be able to run this multiple times)
    delete Object.prototype.isAdmin;
});
