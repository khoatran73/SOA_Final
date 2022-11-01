interface SlugifyOptions {
    replacement?: string;
    remove?: RegExp;
    lower?: boolean;
    strict?: boolean;
    locale?: string;
    trim?: boolean;
}

export const slugifyOpts: SlugifyOptions | string = {
    lower: true, 
    locale: 'vi', 
    trim: true,
};
