/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/document/',
    bare: '/depo/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/js/handler.js',
    bundle: '/js/bundle.js',
    config: '/js/config.js',
    sw: '/js/sw.js',
};