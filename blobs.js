export {
    downloadBlob,
};

const downloadBlob = function (blob, name = `new_file.txt`) {
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
