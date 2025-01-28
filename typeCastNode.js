export {
    blobPromiseFromStream,
};


const blobPromiseFromStream = (stream, mimeType) => {
    return new Response(stream, {headers: new Headers({'Content-Type':  mimeType})}).blob();
};
