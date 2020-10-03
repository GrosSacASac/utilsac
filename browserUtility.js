export {
    downloadBlob,
    evalGlobal,
};

const downloadBlob = function (blob, name = `download_file`) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement(`a`);
    anchor.href = url;
    anchor.download = name;

    // required
    document.body.appendChild(anchor);

    // will prompt file location
    anchor.click();

    // clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(anchor);
};

let evalGlobalId = 0;
const evalGlobalResolves = new Map();

/**
 * 
 * @param {String} code 
 * @param {String<'script' | 'module'>} as 
 */
const evalGlobal = (code, as = `script`) => {
    evalGlobalId += 1;
    const thisId = evalGlobalId;

    const script = document.createElement(`script`);
    let innerHTML = `
    ${code}
    window.evalGlobalReady(${thisId})`;

    if (as === `script`) {
        innerHTML = `"use strict";${innerHTML}`;
    } else if (as === `module`) {
        script.type = `module`;
    }
    script.innerHTML = innerHTML;

    if (!window.evalGlobalReady) {
        window.evalGlobalReady = (id) => {
            const resolve = evalGlobalResolves.get(id);
            if (resolve) {
                evalGlobalResolves.delete(id);
                resolve();
            }
        };
    }

    return new Promise((resolve) => {
        evalGlobalResolves.set(thisId, resolve);
        document.body.appendChild(script);
    });
};
