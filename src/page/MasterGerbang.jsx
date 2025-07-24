import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import {
    FiSearch,
    FiPlus,
    FiRefreshCw,
    FiX,
} from 'react-icons/fi';
import Layout, { CardContainer } from '@/components/common/Layout';
import GerbangTable from '@/components/tables/GerbangTable';
import GerbangForm from '@/components/forms/GerbangForm';
import useGerbangStore from '@/stores/gerbangStore';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { LOADING_STATES } from '@/utils/constants';

const SearchBar = ({
    searchQuery,
    onSearchChange,
    onRefresh,
    loading,
}) => {
    const handleClearSearch = () => {
        onSearchChange('');
    };

    return (
        <HStack spacing={4} w="100%">
            <InputGroup maxW="400px" flex="1">
                <InputLeftElement>
                    <FiSearch color="gray.400" />
                </InputLeftElement>
                <Input
                    placeholder="Cari berdasarkan nama gerbang atau cabang..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    bg="white"
                    disabled={loading}
                />
                {searchQuery && (
                    <InputRightElement>
                        <IconButton
                            icon={<FiX />}
                            size="sm"
                            variant="ghost"
                            onClick={handleClearSearch}
                            aria-label="Clear search"
                        />
                    </InputRightElement>
                )}
            </InputGroup>

            <IconButton
                icon={<FiRefreshCw />}
                variant="outline"
                onClick={onRefresh}
                isLoading={loading}
                aria-label="Refresh data"
                title="Refresh data"
            />
        </HStack>
    );
};

const GerbangModal = ({
    isOpen,
    onClose,
    mode,
    selectedGerbang,
    onSubmit,
    loading,
    error,
}) => {
    const getModalTitle = () => {
        switch (mode) {
            case 'create':
                return 'Tambah Gerbang';
            case 'edit':
                return 'Edit Gerbang';
            case 'view':
                return 'Detail Gerbang';
            default:
                return 'Gerbang';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{getModalTitle()}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <GerbangForm
                        initialData={selectedGerbang}
                        mode={mode}
                        onSubmit={onSubmit}
                        onCancel={onClose}
                        loading={loading}
                        error={error}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

const MasterGerbang = () => {
    const {
        gerbangs,
        searchQuery,
        pagination,
        loading,
        error,
        modalMode,
        selectedGerbang,
        isModalOpen,
        fetchGerbangsPaginated,
        searchGerbangs,
        createGerbang,
        updateGerbang,
        deleteGerbang,
        openModal,
        closeModal,
        setSearchQuery,
    } = useGerbangStore();

    const [isInitialized, setIsInitialized] = useState(false);
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const {
        pagination: tablePagination,
        pageNumbers,
        goToPage,
        changePageSize,
        updateConfig,
    } = usePagination({
        page: pagination.page,
        limit: pagination.limit,
        total_pages: pagination.total_pages,
        count: pagination.count,
    });

    useEffect(() => {
        if (!isInitialized) {
            fetchGerbangsPaginated(1, 10);
            setIsInitialized(true);
        }
    }, [isInitialized, fetchGerbangsPaginated]);

    useEffect(() => {
        updateConfig({
            page: pagination.page,
            limit: pagination.limit,
            total_pages: pagination.total_pages,
            count: pagination.count,
        });
    }, [pagination, updateConfig]);

    useEffect(() => {
        if (debouncedSearchQuery) {
            searchGerbangs(debouncedSearchQuery, 1, tablePagination.pageSize);
        } else {
            fetchGerbangsPaginated(tablePagination.currentPage, tablePagination.pageSize);
        }
    }, [debouncedSearchQuery, searchGerbangs, fetchGerbangsPaginated]);

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    const handleRefresh = () => {
        if (searchQuery) {
            searchGerbangs(searchQuery, tablePagination.currentPage, tablePagination.pageSize);
        } else {
            fetchGerbangsPaginated(tablePagination.currentPage, tablePagination.pageSize);
        }
    };

    const handleAddNew = () => {
        openModal('create');
    };

    const handleEdit = (gerbang) => {
        openModal('edit', gerbang);
    };

    const handleView = (gerbang) => {
        openModal('view', gerbang);
    };

    const handleDelete = async (id, IdCabang) => {
        await deleteGerbang(id, IdCabang);
    };

    const handleSubmit = async (formData) => {
        let success = false;

        if (modalMode === 'create') {
            const result = await createGerbang(formData);
            success = result.success;
        } else if (modalMode === 'edit') {
            const result = await updateGerbang(formData);
            success = result.success;
        }

        if (success) {
            closeModal();
        }
    };

    const handlePageChange = (page) => {
        goToPage(page);
        if (searchQuery) {
            searchGerbangs(searchQuery, page, tablePagination.pageSize);
        } else {
            fetchGerbangsPaginated(page, tablePagination.pageSize);
        }
    };

    const handlePageSizeChange = (size) => {
        changePageSize(size);
        if (searchQuery) {
            searchGerbangs(searchQuery, 1, size);
        } else {
            fetchGerbangsPaginated(1, size);
        }
    };

    const isLoading = loading === LOADING_STATES.LOADING;

    return (
        <Layout
            title="Master Data Gerbang"
            subtitle="Kelola data gerbang dan cabang"
        >
            <VStack spacing={6} p={6}>
             
                <CardContainer
                    title="Pencarian & Aksi"
                    actions={
                        <Button
                            leftIcon={<FiPlus />}
                            colorScheme="blue"
                            onClick={handleAddNew}
                            disabled={isLoading}
                        >
                            Tambah
                        </Button>
                    }
                    w="100%"
                >
                    <SearchBar
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        onRefresh={handleRefresh}
                        loading={isLoading}
                    />
                </CardContainer>

   
                <CardContainer title="Data Gerbang" w="100%">
                    <GerbangTable
                        data={gerbangs}
                        pagination={tablePagination}
                        pageNumbers={pageNumbers}
                        loading={isLoading}
                        error={error}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                    />
                </CardContainer>
            </VStack>

       
            <GerbangModal
                isOpen={isModalOpen}
                onClose={closeModal}
                mode={modalMode}
                selectedGerbang={selectedGerbang}
                onSubmit={handleSubmit}
                loading={isLoading}
                error={error}
            />
        </Layout>
    );
};

export default MasterGerbang;