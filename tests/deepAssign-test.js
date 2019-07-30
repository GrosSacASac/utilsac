(() => {
    console.log(deepAssign({}, { a: 5, b: false, c: { a: 5, b: false, } }, null, { a: 100 }, { c: { b: true, d: [5, 4, 6, 8] } }, { e: [7, 8, 9] }, { e: [777, Symbol(), null, undefined, 8, "k"] }));
})();
