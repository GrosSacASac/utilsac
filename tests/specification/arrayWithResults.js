import test from "ava";
import { arrayWithResults } from "../../utility.js";


test(`it should return an empty array when times is 0`, t => {
    const result = arrayWithResults(function () {
        return 5;
    }, 0);

    t.deepEqual(result, []);
});

test(`it should return an empty array when times is less than 0`, t => {
    const result = arrayWithResults(function () {
        return 5;
    }, -12);

    t.deepEqual(result, []);
});

test(`the function is called exactly the number of times specified`, t => {
    const times = 12;
    let count = 0;
    const result = arrayWithResults(function () {
        count += 1;
        return count;
    }, times);

    t.is(times, count);
});
