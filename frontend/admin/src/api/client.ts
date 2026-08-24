const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('patty_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let detailMsg: string = '';
    if (typeof data.detail === 'string') {
      detailMsg = data.detail;
    } else if (data.detail && typeof data.detail === 'object') {
      detailMsg = data.detail.message || data.detail.error || data.detail.msg || data.detail.detail || '';
    } else if (Array.isArray(data.detail)) {
      detailMsg = data.detail.map((e: any) => (typeof e === 'string' ? e : e.msg || e.message || JSON.stringify(e))).join(', ');
    }

    if (!detailMsg && typeof data.message === 'string') {
      detailMsg = data.message;
    }
    if (!detailMsg && typeof data.error === 'string') {
      detailMsg = data.error;
    }
    if (!detailMsg) {
      detailMsg = response.statusText ? `Error: ${response.status} ${response.statusText}` : 'An unexpected error occurred';
    }

    const customErr: any = new Error(detailMsg);
    customErr.detail = data.detail;
    customErr.data = data;
    customErr.status = response.status;
    throw customErr;
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};
