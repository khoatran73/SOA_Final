export type PaginatedList<T = any> = {
    totalCount: number;
    offset: number;
    limit: number;
    totalPages: number;
    currentPage: number;
    items: Array<T>;
};

export interface PaginatedListQuery {
    offset: number;
    limit: number;
}

export const PaginatedListConstructor = <T = any>(items: Array<T>, offset: number = 0, limit: number = 10): PaginatedList<T> => {
    return {
        currentPage: Math.ceil(limit / (limit - offset) - 1),
        totalCount: items.length,
        totalPages: Math.ceil(items.length / (limit - offset)),
        items: items.slice(offset, limit),
        limit: limit,
        offset: offset,
    };
};
