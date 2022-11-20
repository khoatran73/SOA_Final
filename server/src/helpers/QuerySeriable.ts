export const queryStringSerialize = (obj: any = {}): string => {
    const str = [];
    for (const p in obj)
        if (obj.hasOwnProperty(p) && obj[p] != null) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    return str.join('&');
};