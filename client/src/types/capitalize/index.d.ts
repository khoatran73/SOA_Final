declare module 'capitalize' {
    declare function capitalize(value: string): string;

    declare namespace capitalize {
        export function words(value: string): string;
    }

    export = capitalize;
    export as namespace capitalize;
}
