export class Ajax {
    constructor(options = {}) {
        this.baseURL = options.baseURL || '';
        this.headers = options.headers || {};
        this.timeout = options.timeout || 5000;
    }

    async request(method, url, data = null, options = {}) {
        const controller = new AbortController();
        const id = setTimeout(
            () => controller.abort(),
            options.timeout || this.timeout
        );

        const headers = {
            'Content-Type': 'application/json',
            ...this.headers,
            ...options.headers,
        };

        const fetchOptions = {
            method,
            headers,
            signal: controller.signal,
        };

        if (data !== null) {
            fetchOptions.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(this.baseURL + url, fetchOptions);
            clearTimeout(id);

            if (!response.ok) {
                const defaultMessages = {
                    400: 'Bad Request',
                    401: 'Unauthorized',
                    403: 'Forbidden',
                    404: 'Not Found',
                    500: 'Internal Server Error',
                };

                const statusText =
                    response.statusText ||
                    defaultMessages[response.status] ||
                    'Unknown Error';

                throw new Error(`HTTP ${response.status}: ${statusText}`);
            }

            if (response.status === 204) {
                return null;
            }
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            return await response.text();
        } catch (error) {
            clearTimeout(id);

            if (error.name === 'AbortError') {
                throw new Error(
                    'Timeout: przekroczono maksymalny czas odpowiedzi.'
                );
            }

            throw new Error(error.message);
        }
    }

    async get(url, options = {}) {
        return this.request('GET', url, null, options);
    }

    async post(url, data, options = {}) {
        return this.request('POST', url, data, options);
    }

    async put(url, data, options = {}) {
        return this.request('PUT', url, data, options);
    }

    async delete(url, options = {}) {
        return this.request('DELETE', url, null, options);
    }
}
