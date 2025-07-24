import { useState, useCallback, useMemo } from 'react';
import { DEFAULT_PAGINATION, TABLE_PAGE_SIZES } from '@/utils/constants';

export const usePagination = (initialConfig = {}) => {
    const [config, setConfig] = useState({
        ...DEFAULT_PAGINATION,
        ...initialConfig,
    });

    const goToPage = useCallback((page) => {
        if (page >= 1 && page <= config.total_pages) {
            setConfig(prev => ({ ...prev, page }));
        }
    }, [config.total_pages]);

    const goToFirstPage = useCallback(() => {
        goToPage(1);
    }, [goToPage]);

    const goToLastPage = useCallback(() => {
        goToPage(config.total_pages);
    }, [goToPage, config.total_pages]);

    const goToNextPage = useCallback(() => {
        goToPage(config.page + 1);
    }, [goToPage, config.page]);

    const goToPrevPage = useCallback(() => {
        goToPage(config.page - 1);
    }, [goToPage, config.page]);

    const changePageSize = useCallback((limit) => {
        setConfig(prev => ({
            ...prev,
            limit,
            page: 1, 
        }));
    }, []);

    const updateConfig = useCallback((newConfig) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    const reset = useCallback(() => {
        setConfig(DEFAULT_PAGINATION);
    }, []);


    const pagination = useMemo(() => ({
        ...config,
        hasNextPage: config.page < config.total_pages,
        hasPrevPage: config.page > 1,
        startIndex: (config.page - 1) * config.limit + 1,
        endIndex: Math.min(config.page * config.limit, config.count),
        totalPages: config.total_pages,
        currentPage: config.page,
        pageSize: config.limit,
        totalCount: config.count,
    }), [config]);

    const pageNumbers = useMemo(() => {
        const { page, total_pages } = config;
        const pages = [];
        const maxVisiblePages = 5;

        if (total_pages <= maxVisiblePages) {
            for (let i = 1; i <= total_pages; i++) {
                pages.push(i);
            }
        } else {
        
            let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(total_pages, startPage + maxVisiblePages - 1);

          
            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) {
                    pages.push('...');
                }
            }

            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            
            if (endPage < total_pages) {
                if (endPage < total_pages - 1) {
                    pages.push('...');
                }
                pages.push(total_pages);
            }
        }

        return pages;
    }, [config]);

    return {
        pagination,
        pageNumbers,
        goToPage,
        goToFirstPage,
        goToLastPage,
        goToNextPage,
        goToPrevPage,
        changePageSize,
        updateConfig,
        reset,
    };
};


export const useServerPagination = (fetchFunction, dependencies = []) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        pagination,
        pageNumbers,
        goToPage,
        goToFirstPage,
        goToLastPage,
        goToNextPage,
        goToPrevPage,
        changePageSize,
        updateConfig,
        reset,
    } = usePagination();

    const fetchData = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchFunction({
                page: pagination.currentPage,
                limit: pagination.pageSize,
                ...params,
            });

            if (response.success) {
                updateConfig({
                    total_pages: response.data.total_pages || 0,
                    count: response.data.count || 0,
                });
            } else {
                setError(response.error);
            }

            return response;
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [fetchFunction, pagination.currentPage, pagination.pageSize, updateConfig]);

    const goToPageAndFetch = useCallback(async (page, params = {}) => {
        goToPage(page);
        await fetchData(params);
    }, [goToPage, fetchData]);

    const changePageSizeAndFetch = useCallback(async (limit, params = {}) => {
        changePageSize(limit);
        await fetchData(params);
    }, [changePageSize, fetchData]);

    return {
        pagination,
        pageNumbers,
        loading,
        error,
        fetchData,
        goToPage: goToPageAndFetch,
        goToFirstPage: () => goToPageAndFetch(1),
        goToLastPage: () => goToPageAndFetch(pagination.totalPages),
        goToNextPage: () => goToPageAndFetch(pagination.currentPage + 1),
        goToPrevPage: () => goToPageAndFetch(pagination.currentPage - 1),
        changePageSize: changePageSizeAndFetch,
        reset,
    };
};