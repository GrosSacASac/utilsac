(() => {
const deepAssign = (target, ...sources) => {
   sources.forEach(source => {
       if (!source || typeof source !== "object") {
           return;
       }
       Object.entries(source).forEach(([key, value]) => {
           if (!value || typeof value !== "object") {
               target[key] = value;
               return;
           }
           if (Array.isArray(value)) {
               target[key] = [];
           }
           // value is an Object
           if (typeof target[key] !== "object" || !target[key]) {
               target[key] = {};
           }
           deepAssign(target[key], value);
       });
   });
   return target;
};
console.log(deepAssign({}, {a:5, b: false, c: {a:5, b: false,}}, null, {a: 100}, {c: {b: true, d: [5,4,6,8]}}, {e: [7,8,9]}, {e: [777, Symbol(), null, undefined, 8, "k"]}));
})();
