declare module 'vn-badwords' {
    declare namespace list {
        export const array: string[];
        export const regexp: RegExp;
    }

    export = list;
    export as namespace list;
}
