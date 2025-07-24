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
    FiCalendar,
    FiFilter,
    FiRefreshCw,
    FiDownload,
    FiX,
} from 'react-icons/fi';
import Layout, { CardContainer } from '@/components/common/Layout';
import LalinTable from '@/components/tables/LalinTable';
import useLalinStore from '@/stores/lalinStore';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/utils/formatters';
import { LOADING_STATES } from '@/utils/constants';


const SearchAndFilter = ({
    searchQuery,
    onSearchChange,
    selectedDate,
    onDateChange,
    onFilter,
    onReset,
    onExport,
    loading,
}) => {
    const [dateInput, setDateInput] = useState(
        selectedDate ? formatDate(selectedDate, 'yyyy-MM-dd') : ''
    );

    const handleDateChange = (e) => {
        setDateInput(e.target.value);
        if (e.target.value) {
            onDateChange(new Date(e.target.value));
        }
    };

    const handleClearSearch = () => {
        onSearchChange('');
    };

    return (
        <VStack spacing={4} align="stretch">
            <HStack spacing={4} flexWrap="wrap">
           
                <InputGroup maxW="400px" flex="1">
                    <InputLeftElement>
                        <FiSearch color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder="Cari berdasarkan gerbang, ruas, atau gardu..."
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

              
                <InputGroup maxW="200px">
                    <Input
                        type="date"
                        value={dateInput}
                        onChange={handleDateChange}
                        disabled={loading}
                        bg="white"
                    />
                    <InputRightElement>
                        <FiCalendar color="gray.400" />
                    </InputRightElement>
                </InputGroup>
            </HStack>

            <HStack spacing={3} flexWrap="wrap">
                <Button
                    leftIcon={<FiFilter />}
                    colorScheme="blue"
                    onClick={onFilter}
                    isLoading={loading}
                    loadingText="Filter"
                >
                    Filter
                </Button>

                <Button
                    leftIcon={<FiRefreshCw />}
                    variant="outline"
                    onClick={onReset}
                    disabled={loading}
                >
                    Reset
                </Button>

                <Button
                    leftIcon={<FiDownload />}
                    colorScheme="green"
                    variant="outline"
                    onClick={onExport}
                    disabled={loading}
                >
                    Export
                </Button>
            </HStack>
        </VStack>
    );
};

const DetailModal = ({ isOpen, onClose, data }) => {
    if (!data) return null;

    const totalLalin =
        (data.Tunai || 0) +
        (data.eMandiri || 0) +
        (data.eBri || 0) +
        (data.eBni || 0) +
        (data.eBca || 0) +
        (data.eNobu || 0) +
        (data.eDKI || 0) +
        (data.eMega || 0) +
        (data.eFlo || 0);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Detail Data Lalin
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        <Box>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                Informasi Umum
                            </Text>
                            <VStack spacing={2} align="stretch">
                                <HStack justify="space-between">
                                    <Text fontSize="sm">ID:</Text>
                                    <Text fontSize="sm" fontWeight="semibold">{data.id}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text fontSize="sm">Tanggal:</Text>
                                    <Text fontSize="sm" fontWeight="semibold">{formatDate(data.Tanggal)}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text fontSize="sm">Shift:</Text>
                                    <Text fontSize="sm" fontWeight="semibold">Shift {data.Shift}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text fontSize="sm">Golongan:</Text>
                                    <Text fontSize="sm" fontWeight="semibold">Golongan {data.Golongan}</Text>
                                </HStack>
                            </VStack>
                        </Box>

                        <Box>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                Lokasi
                            </Text>
                            <VStack spacing={2} align="stretch">
                                <HStack justify="space-between">
                                    <Text fontSize="sm">ID Cabang:</Text>
                                    <Text fontSize="sm" fontWeight="semibold">{data.IdCabang}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text fontSize="sm">ID Gerbang:</Text>
                                    <Text fontSize="sm" fontWeight="semibold">{data.IdGerbang}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text fontSize="sm">ID Gardu:</Text>
                                    <Text fontSize="sm" fontWeight="semibold">{data.IdGardu || '-'}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text fontSize="sm">ID Asal Gerbang:</Text>
                                    <Text fontSize="sm" fontWeight="semibold">{data.IdAsalGerbang || '-'}</Text>
                                </HStack>
                            </VStack>
                        </Box>

                        <Box>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                Detail Pembayaran
                            </Text>
                            <VStack spacing={2} align="stretch">
                                <HStack justify="space-between">
                                    <Text fontSize="sm">Tunai:</Text>
                                    <Text fontSize="sm" fontWeight="semibold">{data.Tunai || 0}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text fontSize="sm">e-Mandiri:</Text>
                                    <Text fontSize="sm" fontWeight="semibold">{data.eMandiri || 0}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text fontSize="sm">e-BRI:</Text>
                                    <Text fontSize="sm" fontWeight="semibold">{data.eBri || 0}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text fontSize="sm">e-BNI:</Text>
                                    <Text fontSize="sm" fontWeight="semibold">{data.eBni || 0}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text fontSize="sm">e-BCA:</Text>
                                    <Text fontSize="sm" fontWeight="semibold">{data.eBca || 0}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text fontSize="sm">e-Flo:</Text>
                                    <Text fontSize="sm" fontWeight="semibold">{data.eFlo || 0}</Text>
                                </HStack>
                                <Box borderTopWidth="1px" pt={2}>
                                    <HStack justify="space-between">
                                        <Text fontSize="sm" fontWeight="semibold">Total Lalin:</Text>
                                        <Text fontSize="sm" fontWeight="bold" color="blue.600">{totalLalin}</Text>
                                    </HStack>
                                </Box>
                            </VStack>
                        </Box>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={onClose}>
                        Tutup
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const LalinReport = () => {
    const {
        lalins,
        selectedDate,
        searchQuery,
        pagination,
        loading,
        error,
        selectedPaymentMethod,
        fetchLalinsByDate,
        searchLalins,
        exportData,
        setSelectedDate,
        setSearchQuery,
        setSelectedPaymentMethod,
    } = useLalinStore();

    const [isInitialized, setIsInitialized] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();

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
            const today = new Date();
            setSelectedDate(today);
            fetchLalinsByDate(today, 1, 10);
            setIsInitialized(true);
        }
    }, [isInitialized, setSelectedDate, fetchLalinsByDate]);

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
            searchLalins(debouncedSearchQuery);
        } else if (selectedDate) {
            fetchLalinsByDate(selectedDate, tablePagination.currentPage, tablePagination.pageSize);
        }
    }, [debouncedSearchQuery, selectedDate, searchLalins, fetchLalinsByDate]);

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleFilter = () => {
        if (searchQuery) {
            searchLalins(searchQuery);
        } else if (selectedDate) {
            fetchLalinsByDate(selectedDate, 1, tablePagination.pageSize);
        }
    };

    const handleReset = () => {
        setSearchQuery('');
        const today = new Date();
        setSelectedDate(today);
        fetchLalinsByDate(today, 1, 10);
    };

    const handleExport = async () => {
        await exportData('excel');
    };

    const handlePageChange = (page) => {
        goToPage(page);
        if (searchQuery) {
            searchLalins(searchQuery);
        } else if (selectedDate) {
            fetchLalinsByDate(selectedDate, page, tablePagination.pageSize);
        }
    };

    const handlePageSizeChange = (size) => {
        changePageSize(size);
        if (searchQuery) {
            searchLalins(searchQuery);
        } else if (selectedDate) {
            fetchLalinsByDate(selectedDate, 1, size);
        }
    };

    const handleViewDetail = (data) => {
        setSelectedDetail(data);
        onDetailOpen();
    };

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
    };

    const isLoading = loading === LOADING_STATES.LOADING;

    return (
        <Layout
            title="Laporan Lalin Per Hari"
            subtitle={`Data lalu lintas untuk ${selectedDate ? formatDate(selectedDate) : 'hari ini'}`}
        >
            <VStack spacing={6} p={6}>
          
                <CardContainer title="Filter & Pencarian" w="100%">
                    <SearchAndFilter
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                        onFilter={handleFilter}
                        onReset={handleReset}
                        onExport={handleExport}
                        loading={isLoading}
                    />
                </CardContainer>

         
                <CardContainer title="Data Laporan Lalin" w="100%">
                    <LalinTable
                        data={lalins}
                        pagination={tablePagination}
                        pageNumbers={pageNumbers}
                        loading={isLoading}
                        error={error}
                        selectedPaymentMethod={selectedPaymentMethod}
                        onPaymentMethodChange={handlePaymentMethodChange}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        onViewDetail={handleViewDetail}
                    />
                </CardContainer>
            </VStack>

         
            <DetailModal
                isOpen={isDetailOpen}
                onClose={onDetailClose}
                data={selectedDetail}
            />
        </Layout>
    );
};

export default LalinReport;