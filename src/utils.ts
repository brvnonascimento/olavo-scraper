export const removeSlash = (url: string) => url.replace(/\//g, '');

export const toArray = (obj: DOMTokenList) => {
    let array = [];
    // iterate backwards ensuring that length is an UInt32
    for (let i = obj.length >>> 0; i--;) {
        array[i] = obj[i];
    }
    return array;
}