
const {
    textFileContentPromiseFromPath,
    writeTextInFilePromiseFromPathAndString
} = require("../files.js");

const initialString = `abc - éùô - xwz`;

const pathDeep = `a/b/c.txt`;

writeTextInFilePromiseFromPathAndString(pathDeep, initialString).then(function () {
    textFileContentPromiseFromPath(pathDeep).then(function (result) {
        console.log(`success`, result === initialString);
        console.log(result);
    })
});
