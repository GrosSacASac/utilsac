/*files.js*/
"use strict";
const fs = require("fs");

const textFileContentPromiseFromPath = function (path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, "utf-8", function (error, data) {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    });
};

const writeTextInFilePromiseFromPathAndString = function (path, string) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(path, string, "utf-8", function (error, notUsed) {
            if (error) {
                reject(error);
            }
            resolve();
        });
    });
};

const concatenateFiles = function (files, destination, separator=``) {
    return Promise.all(files.map(textFileContentPromiseFromPath)).then(
    function (contents) {
        return writeTextInFilePromiseFromPathAndString(destination, contents.join(separator))
    });
};  

const copyFile = function (sourcePath, destination) {
    /* fs.copyFile exists in Node 9+ 
    todo if dest cannot be reached created folders until it is*/
    return new Promise(function (resolve, reject) {
        if (!fs.existsSync(sourcePath)) {
            reject(`${sourcePath} does not exist`);
            return;
        }

        fs.copyFile(sourcePath, destination, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(`${sourcePath} was copied to ${destination}`);
        });
    });
};

const deleteFile = function (sourcePath) {
    return new Promise(function (resolve, reject) {
        fs.unlink(sourcePath, function(error) {
            if(error && error.code == "ENOENT") {
                // file doens't exist
                resolve(`File ${sourcePath} doesn't exist, won't remove it.`);
            } else if (error) {
                // other errors, e.g. maybe we don't have enough permission
                reject(`Error occurred while trying to remove file ${sourcePath}`);
            } else {
                resolve(`removed`);
            }
        });
    });
};



module.exports = {
    textFileContentPromiseFromPath,
    writeTextInFilePromiseFromPathAndString,
    concatenateFiles,
    copyFile,
    deleteFile
};
