import { useState, useCallback, useContext } from 'react';

export const useHttp = () => {
    // Установка состояний ошибки и загрузки
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const originalRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);
        try {
            const response = await fetch(url, { method, body, headers });
            const data = await response.json();

            setLoading(false);

            return {response, data};
        } catch (e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, []);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);
        try {
            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }

            let { response, data } = await originalRequest(url, method, body, headers);

            setLoading(false);

            return data;
        } catch (e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);  // Очистка ошибок

    return { loading, request, error, clearError};             // Возвращение объектов для взаимодействия с сервером
};