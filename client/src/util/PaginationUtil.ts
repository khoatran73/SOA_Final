export default class PaginationUtil {
    static countOffset = (pageNumber: number, itemsPerPage: number) => {
        return itemsPerPage * (pageNumber - 1);
    };

    static countLimit = (pageNumber: number, itemsPerPage: number) => {
        const offset = this.countOffset(pageNumber, itemsPerPage);
        return itemsPerPage + offset;
    };
}
