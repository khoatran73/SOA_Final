type StatusCode = '200' | '400' | '403' | '404' | '500';


/**
 * @openapi
 * components:
 *  types:
 *    ApiResponse:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *        message:
 *          type: string
 *          default: string
 *        statusCode:
 *          type: string
 *          default: string
*        result:
 *          type: object
 */

export interface ApiResponse<T = any> {
    success?: boolean;
    message?: string;
    error?: Record<string, string[]>;
    statusCode?: StatusCode;
    result?: T;
}

export const ResponseOk = <T = any>(result?: T, message: string | undefined = undefined): ApiResponse<T> => {
    return {
        result: result,
        message: message,
        success: true,
        statusCode: '200',
    } as ApiResponse<T>;
};

export const ResponseFail = <T = any>(
    message: string | undefined = undefined,
    error: Record<string, string[]> | undefined = undefined,
    statusCode: StatusCode = '200',
): ApiResponse<T> => {
    return {
        message: message,
        success: false,
        statusCode: statusCode,
        error: error,
    };
};
