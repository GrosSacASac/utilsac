/*files.js*/
"use strict";
const fs = require("fs");
const path = require("path");

const createNecessaryDirectories = function (filePath) {
    const directoryname = path.dirname(filePath);
    if (fs.existsSync(directoryname)) {
      return;
    }
    createNecessaryDirectories(directoryname);
    fs.mkdirSync(directoryname);
};

const textFileContent = function (filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, "utf-8", function (error, data) {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    });
};

const writeTextInFile = function (filePath, string) {
    return new Promise(function (resolve, reject) {
        createNecessaryDirectories(filePath);
        fs.writeFile(filePath, string, "utf-8", function (error, notUsed) {
            if (error) {
                reject(error);
				return;
            }
            resolve();
        });
    });
};


const concatenateFiles = function (files, destination, separator=``) {
    return Promise.all(files.map(textFileContent)).then(
    function (contents) {
        return writeTextInFile(
            destination,
            contents.join(separator)
        );
    });
};

const copyFile = function (filePath, filePathDestination) {
    /* fs.copyFile exists in Node 9+ */
    return new Promise(function (resolve, reject) {
        if (!fs.existsSync(filePath)) {
            reject(`${filePath} does not exist`);
            return;
        }

        createNecessaryDirectories(filePathDestination);
        fs.copyFile(filePath, filePathDestination, (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(`${filePath} was copied to ${filePathDestination}`);
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
    textFileContent,
    writeTextInFile,
    concatenateFiles,
    copyFile,
    deleteFile
};
