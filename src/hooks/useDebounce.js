import { useState, useEffect, useCallback, useRef } from 'react';


export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};


export const useDebounceCallback = (callback, delay, dependencies = []) => {
    const timeoutRef = useRef(null);

    const debouncedCallback = useCallback(
        (...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay, ...dependencies]
    );

    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return [debouncedCallback, cancel];
};


export const useDebounceSearch = (searchFunction, delay = 500) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const debouncedQuery = useDebounce(query, delay);

    const search = useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await searchFunction(searchQuery);

            if (response.success) {
                setResults(response.data || []);
            } else {
                setError(response.error);
                setResults([]);
            }
        } catch (err) {
            setError(err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [searchFunction]);

    useEffect(() => {
        search(debouncedQuery);
    }, [debouncedQuery, search]);

    const clearSearch = useCallback(() => {
        setQuery('');
        setResults([]);
        setError(null);
        setLoading(false);
    }, []);

    return {
        query,
        setQuery,
        results,
        loading,
        error,
        clearSearch,
    };
};


export const useDebounceValidation = (initialValue = '', validator, delay = 300) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isValid, setIsValid] = useState(true);

    const debouncedValue = useDebounce(value, delay);

    const validate = useCallback(async (val) => {
        if (!validator || !val) {
            setError(null);
            setIsValid(true);
            setIsValidating(false);
            return;
        }

        setIsValidating(true);

        try {
            const validationResult = await validator(val);

            if (validationResult === null || validationResult === true) {
                setError(null);
                setIsValid(true);
            } else {
                setError(validationResult);
                setIsValid(false);
            }
        } catch (err) {
            setError(err.message);
            setIsValid(false);
        } finally {
            setIsValidating(false);
        }
    }, [validator]);

    useEffect(() => {
        validate(debouncedValue);
    }, [debouncedValue, validate]);

    const reset = useCallback(() => {
        setValue(initialValue);
        setError(null);
        setIsValid(true);
        setIsValidating(false);
    }, [initialValue]);

    return {
        value,
        setValue,
        error,
        isValid,
        isValidating,
        reset,
    };
};