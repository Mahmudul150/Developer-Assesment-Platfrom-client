export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  totalPage?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Meta;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: Meta;
}

export interface ApiErrorBody extends ApiResponse<unknown> {
  success: false;
  errors?: Array<{ field?: string; message: string }>;
}

export class ApiError extends Error {
  readonly status: number;
  readonly errors: Array<{ field?: string; message: string }>;

  constructor(
    message: string,
    status = 0,
    errors: Array<{ field?: string; message: string }> = [],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}
