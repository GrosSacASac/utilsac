export {
    blobPromiseFromStream,
};

// import { // also
//     arrayBuffer as arrayBufferPromiseFromStream,
//     blob as blobPromiseFromStream,
//     buffer as bufferPromiseFromStream,
//     json as jsonPromiseFromStream,
//     text as textPromiseFromStream,
// } from "node:stream/consumers"; 


const blobPromiseFromStream = (stream, mimeType) => {
    return new Response(stream, {headers: new Headers({'Content-Type':  mimeType})}).blob();
};
