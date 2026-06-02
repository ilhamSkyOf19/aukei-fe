export interface ResponseStructure<T> {
  meta: {
    statusCode: number;
    message: string;
  };
  data: T;
}

// error response
export interface ErrorResponse {
  meta: {
    statusCode: number;
    message: string;
    customField?: string[];
  };
  data: null;
}
