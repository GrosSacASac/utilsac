export { evalGlobal };

let evalGlobalId = 0;
const evalGlobalResolves = new Map();

const evalGlobal = (code) => {
    evalGlobalId += 1;
    const thisId = evalGlobalId;
    const script = document.createElement(`script`);
    script.innerHTML = `"use strict";
    ${code}
    window.evalGlobalReady(${thisId})`;
    if (!window.evalGlobalReady) {
        window.evalGlobalReady = (id) => {
            const resolve = evalGlobalResolves.get(id);
            if (resolve) {
                evalGlobalResolves.delete(id);
                resolve();
            }
        }
    }
    return new Promise((resolve, reject) => {
        evalGlobalResolves.set(thisId, resolve);
        document.body.appendChild(script);
    });
};
