export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getServerOrigin(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

function resolveRequestUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  if (typeof window !== "undefined") {
    return `${API_BASE_URL}${path}`;
  }

  const origin = API_BASE_URL || getServerOrigin();

  return `${origin}${path}`;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(resolveRequestUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get<T>(path: string): Promise<T> {
    return request<T>(path);
  },

  post<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};
