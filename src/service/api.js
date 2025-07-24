import axios from 'axios';
import { API_BASE_URL, ERROR_MESSAGES } from '@/utils/constants';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        if (!response) {
          
            toast.error(ERROR_MESSAGES.NETWORK_ERROR);
            return Promise.reject(error);
        }

        const { status, data } = response;

        switch (status) {
            case 401:
      
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                toast.error(ERROR_MESSAGES.UNAUTHORIZED);
                break;

            case 403:
                toast.error(ERROR_MESSAGES.FORBIDDEN);
                break;

            case 404:
                toast.error(ERROR_MESSAGES.NOT_FOUND);
                break;

            case 422:
          
                const message = data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
                toast.error(message);
                break;

            case 500:
            default:
                const errorMessage = data?.message || ERROR_MESSAGES.SERVER_ERROR;
                toast.error(errorMessage);
                break;
        }

        return Promise.reject(error);
    }
);

export const apiRequest = async (config) => {
    try {
        const response = await api(config);
        return {
            success: true,
            data: response.data,
            status: response.status,
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || error.message,
            status: error.response?.status,
        };
    }
};


export const get = async (url, params = {}) => {
    return apiRequest({
        method: 'GET',
        url,
        params,
    });
};


export const post = async (url, data = {}) => {
    return apiRequest({
        method: 'POST',
        url,
        data,
    });
};


export const put = async (url, data = {}) => {
    return apiRequest({
        method: 'PUT',
        url,
        data,
    });
};


export const del = async (url, data = {}) => {
    return apiRequest({
        method: 'DELETE',
        url,
        data,
    });
};


export const upload = async (url, formData) => {
    return apiRequest({
        method: 'POST',
        url,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


export const download = async (url, params = {}) => {
    try {
        const response = await api({
            method: 'GET',
            url,
            params,
            responseType: 'blob',
        });

        return {
            success: true,
            data: response.data,
            headers: response.headers,
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || error.message,
        };
    }
};


export const triggerDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export default api;