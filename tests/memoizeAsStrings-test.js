
import {memoizeAsStrings} from "../utility.js";

let TRY;
let oi = [];
TRY = function (x, y, z) {
    const separator = "-";
    const previousResults = {};
    return ([8,4,3,7,8,9,9,9,9,9,9,9,9,9,9,9,9,9,8,8,87,8,78,7,8,78,7,87,87].map(function (u) {
        return (u * x ** 2 + y ** (1/3) - ((z !== 2) ? TRY(x,y,2): - 5 ));
    }).sort()[0]);
};

console.log("without memo");

console.time("TRY");
oi.push(TRY(5,5,5));
console.timeEnd("TRY");
console.time("TRY");
oi.push(TRY(5,5,5));
console.timeEnd("TRY");
console.time("TRY");
oi.push(TRY(5,5,5));
console.timeEnd("TRY");
console.time("TRY");
oi.push(TRY(5,5,5));
console.timeEnd("TRY");
console.time("TRY");
oi.push(TRY(5,8,5));
console.timeEnd("TRY");
console.time("TRY");
oi.push(TRY(2,3,6));
console.timeEnd("TRY");
console.time("TRY");
oi.push(TRY(5,8,5));
console.timeEnd("TRY");

console.log("with memo");
TRY = memoizeAsStrings(TRY);

console.time("TRY");
oi.push(TRY(5,5,5));
console.timeEnd("TRY");
console.time("TRY");
oi.push(TRY(5,5,5));
console.timeEnd("TRY");
console.time("TRY");
oi.push(TRY(5,5,5));
console.timeEnd("TRY");
console.time("TRY");
oi.push(TRY(5,5,5));
console.timeEnd("TRY");
console.time("TRY");
oi.push(TRY(5,8,5));
console.timeEnd("TRY");
console.time("TRY");
oi.push(TRY(2,3,6));
console.timeEnd("TRY");
console.time("TRY");
oi.push(TRY(5,8,5));
console.timeEnd("TRY");

console.log(oi);
