
import { decorateForceSequential } from "../../utility.js";
import {setTimeout} from "node:timers/promises";

let lastTime = Date.now();
const beginning = Date.now();
// const original = function () {
//     return setTimeout(100, true).then(function () {
//         const now = Date.now();
//         const timeSinceBeginning  = now - beginning;
//         return timeSinceBeginning;
//     })
// }
const original = function () {
    return setTimeout(1000, true).then(function () {
        const now = Date.now();
        const timeSinceLast  = now - lastTime;
        lastTime = now;
        return timeSinceLast;
    });
};

const decorated = decorateForceSequential(original);

// await Promise.all([original(), original()]).then(console.log);
// original().then(console.log);
// original().then(console.log);
decorated().then(console.log);
decorated().then(console.log);
