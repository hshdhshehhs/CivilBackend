/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/document/',
    bare: '/depo/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: 'handler.js',
    bundle: 'bundle.js',
    config: 'config.js',
    sw: 'sw.js',
};