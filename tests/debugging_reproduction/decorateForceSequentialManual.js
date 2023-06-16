
import { decorateForceSequential } from "../../utility.js";
import {setTimeout as setTimeoutPromise} from "node:timers/promises";

let lastTime = Date.now();
const original = function () {
    return setTimeoutPromise(1000, true).then(function () {
        const now = Date.now();
        const timeSinceLast  = now - lastTime;
        lastTime = now;
        return timeSinceLast;
    });
};

const decorated = decorateForceSequential(original);

await Promise.all([decorated(), decorated()]).then(console.log);

decorated().then(console.log);
decorated().then(console.log);
