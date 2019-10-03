import test from "ava";
import { deepAssign } from "../../utility.js";
import { primitives } from "../helper.js";


test(`it should work like Object.assign`, t => {
    const source = {
        a: 1,
        b: 2,
    };
    const target = {};

    deepAssign(target, source);

    Object.entries(source).forEach(([key, value]) => {
        t.is(target[key], value);
    });
});

test(`it should return the target`, t => {
    const source = {
        a: 1,
    };
    const target = {};

    t.is(deepAssign(target, source), target);
});

test(`it should create new object references`, t => {
    const source = {
        a: 1,
        b: {
            c: 2,
        },
    };
    const target = {};

    deepAssign(target, source);
    target.b.c = 3;

    t.is(source.b.c, 2);
});

test(`it should work with multiple sources`, t => {
    const target = {};

    deepAssign(
        target,
        { a: 5, b: false, c: { a: 5, b: false } },
        null,
        { a: 100 },
        { c: { b: true, d: [5, 4, 6, 8] } },
        { e: [7, 8, 9] },
        { e: [777, Symbol(), null, undefined, 8, "k"] },
    );

    // sources assign on top of each other according to the order 
    t.is(target.a, 100);
    t.is(target.b, false);
    t.deepEqual(target.c, { a: 5, b: true, d: [5, 4, 6, 8] });
});

test(`it should silently discard primitives like Object.assign`, t => {
    const target = {};

    deepAssign(target, ...primitives);

    t.is(Object.keys(target).length, 0);
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
