(function () {

  const timePromise = function (promiseCreator) {
    /* returns a Promise that resolves with
    the time elapsed for the promise to resolve and its value
    executes promiseCreator and waits for it to resolve */

      const startTime = performance.now();
      return promiseCreator().then(function (value) {
          const endTime = performance.now();
          return {
              timeElapsed: endTime - startTime,
              value
          };
      });
};
  timePromise(() => fetch(`https://duckduckgo.com/lite`)).then(console.log)
}());
  