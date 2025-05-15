export interface BaseAPIResponseModel<T> {
    code: number;
    message: string;
    data: T;
}