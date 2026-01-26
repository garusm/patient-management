const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4004';

class ApiClient {
    private token: string | null = null;

    setToken(token: string | null) {
        this.token = token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.text().catch(() => 'Unknown error');
            throw new Error(error || `HTTP error! status: ${response.status}`);
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    // Auth endpoints
    async login(email: string, password: string) {
        const response = await this.request<{ token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        return response;
    }

    async validateToken(): Promise<boolean> {
        try {
            await this.request('/auth/validate');
            return true;
        } catch {
            return false;
        }
    }

    // Patient endpoints
    async getPatients() {
        return this.request<import('@/types').Patient[]>('/api/patients');
    }

    async createPatient(patient: import('@/types').PatientRequest) {
        return this.request<import('@/types').Patient>('/api/patients', {
            method: 'POST',
            body: JSON.stringify(patient),
        });
    }

    async updatePatient(id: string, patient: Partial<import('@/types').PatientRequest>) {
        return this.request<import('@/types').Patient>(`/api/patients/${id}`, {
            method: 'PUT',
            body: JSON.stringify(patient),
        });
    }

    async deletePatient(id: string) {
        return this.request<void>(`/api/patients/${id}`, {
            method: 'DELETE',
        });
    }
}

export const api = new ApiClient();
