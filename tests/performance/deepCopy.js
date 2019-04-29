"use strict"; // todo make the test work without manual import
const performanceTestFrameWork = require("./performanceTestFrameWork.js"); // https://github.com/GrosSacASac/JavaScript-Set-Up/blob/master/js/performanceTestFrameWork.js

const deepCopy = require("./deepCopy.js"); // utilsac
const deepCopyJSON = x => JSON.parse(JSON.stringify(x));

const a = {
    b:7,
    c: "",
    d: "ddddd",
    e: {
        f: {},
        g: "g",
        z: {z: {z: {z: {eq: null, o: -45}}}}
    },
    h: [5,43]
};

let b;

const JSONTest = {
	name: 'JSON',
	code: (shared, finish) => {
            b = deepCopyJSON(a);
			finish();
		}
};

const deepCopyTest = {
	name: 'deepCopy',
	code: (shared, finish) => {
            b = deepCopy(a);
			finish();
		}
};

const ref = {
	name: 'ref',
	code: (shared, finish) => {
            setTimeout(finish, 10);
		}
};

const testSuite = performanceTestFrameWork.create({
	tests: [JSONTest, deepCopyTest, ref],
	maxTime: 50
});

performanceTestFrameWork.runAll(testSuite);
