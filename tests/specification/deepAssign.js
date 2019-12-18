import test from "ava";
import { deepAssign, deepAssignAdded } from "../../deep.js";
import { primitives } from "../helper.js";


const runBaselineDeepAssignTests = (deepAssignImplementation) => {
    const { name } = deepAssignImplementation;
    test(` ${name} it should work like Object.assign`, t => {
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

    test(` ${name} it should return the target`, t => {
        const source = {
            a: 1,
        };
        const target = {};

        t.is(deepAssign(target, source), target);
    });

    test(`${name} it should create new object references`, t => {
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

    test(`${name} it should work with multiple sources`, t => {
        const target = {};

        deepAssign(
            target,
            { a: 5, b: false, c: { a: 5, b: false } },
            null,
            { a: 1024 },
            { c: { b: true, d: [5, 4, 6, 8] } },
            { e: [7, 8, 9] },
            { e: [512, Symbol(), null, undefined, 8, `k`] },
        );

        // sources assign on top of each other according to the order 
        t.is(target.a, 1024);
        t.is(target.b, false);
        t.deepEqual(target.c, { a: 5, b: true, d: [5, 4, 6, 8] });
    });

    test(`${name} it should silently discard primitives like Object.assign`, t => {
        const target = {};

        deepAssign(target, ...primitives);

        t.is(Object.keys(target).length, 0);
    });

    test(`${name} it should avoid prototype pollution`, t => {
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

    /*const copy = */deepAssign({}, parsedInput);

        // mistake 5 defensive style, unecessary  copy, better is to have convention to not modify input in functions
        // mistake 6 copy everything, be lazy !

        t.is(user1.isAdmin, undefined);

        // recovery (only to be able to run this multiple times)
        delete Object.prototype.isAdmin;
    });
};

runBaselineDeepAssignTests(deepAssign);
runBaselineDeepAssignTests(deepAssignAdded);

test(`deepAssignAdded should work for Set`, t => {
    const target = {};

    const set1 = new Set([1, 2, 3]);
    const source = {set: set1};

    deepAssignAdded(target, source);

    t.deepEqual(target.set, set1);
    t.is(target.set.constructor, Set);
});

test(`deepAssignAdded should work for Map`, t => {
    const target = {};

    const map1 = new Map([[1, 2], [2, 3]]);
    const source = {map: map1};

    deepAssignAdded(target, source);

    t.deepEqual(target.map, map1);
    t.is(target.map.constructor, Map);
});

test(`deepAssignAdded should work for Date`, t => {
    const target = {};

    const date1 = new Date();
    date1.setTime(4);
    const source = {date: date1};

    deepAssignAdded(target, source);

    t.deepEqual(target.date, date1);
    t.is(target.date.getTime(), date1.getTime());
    t.is(target.date.constructor, Date);
});

test(`deepAssignAdded should work for RegExp`, t => {
    const target = {};

    const regex1 = new RegExp(`\\w+`);
    const source = { a: { b: regex1 } };

    deepAssignAdded(target, source);
    console.log(target)

    t.deepEqual(target.a.b, regex1);
    t.is(String(target.a.b), String(regex1));
    t.is(target.a.b.constructor, RegExp);
});
