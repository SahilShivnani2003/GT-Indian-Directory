export interface ApiError {
    status: number;
    message: string;
    response?: any;
}