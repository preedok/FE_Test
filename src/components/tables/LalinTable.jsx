import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    Text,
    HStack,
    VStack,
    Button,
    IconButton,
    Select,
    Badge,
    Flex,
    Spacer,
} from '@chakra-ui/react';
import {
    FiChevronLeft,
    FiChevronRight,
    FiChevronsLeft,
    FiChevronsRight,
    FiEye,
} from 'react-icons/fi';
import { formatNumber, formatDate, formatRowNumber } from '@/utils/formatters';
import { TABLE_PAGE_SIZES } from '@/utils/constants';
import Loading from '@/components/common/Loading';


const TablePagination = ({
    pagination,
    pageNumbers,
    onPageChange,
    onPageSizeChange,
    loading,
}) => {
    const {
        currentPage,
        totalPages,
        pageSize,
        totalCount,
        startIndex,
        endIndex,
        hasNextPage,
        hasPrevPage,
    } = pagination;

    return (
        <Flex
            justify="space-between"
            align="center"
            mt={4}
            p={4}
            bg="gray.50"
            borderRadius="md"
            flexWrap="wrap"
            gap={4}
        >
            <HStack spacing={2}>
                <Text fontSize="sm" color="gray.600">
                    Menampilkan
                </Text>
                <Text fontSize="sm" fontWeight="semibold">
                    {startIndex}-{endIndex}
                </Text>
                <Text fontSize="sm" color="gray.600">
                    dari {formatNumber(totalCount)} data
                </Text>
            </HStack>

            <HStack spacing={2}>
                <Text fontSize="sm" color="gray.600">
                    Tampilkan:
                </Text>
                <Select
                    size="sm"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
                    maxW="80px"
                    disabled={loading}
                >
                    {TABLE_PAGE_SIZES.map(size => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </Select>
                <Text fontSize="sm" color="gray.600">
                    per halaman
                </Text>
            </HStack>

            <HStack spacing={1}>
                <IconButton
                    icon={<FiChevronsLeft />}
                    size="sm"
                    variant="outline"
                    onClick={() => onPageChange(1)}
                    disabled={!hasPrevPage || loading}
                    aria-label="First page"
                />
                <IconButton
                    icon={<FiChevronLeft />}
                    size="sm"
                    variant="outline"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevPage || loading}
                    aria-label="Previous page"
                />

                {pageNumbers.map((page, index) => (
                    <Button
                        key={index}
                        size="sm"
                        variant={page === currentPage ? 'solid' : 'outline'}
                        colorScheme={page === currentPage ? 'blue' : 'gray'}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={typeof page !== 'number' || loading}
                        minW="8"
                    >
                        {page}
                    </Button>
                ))}

                <IconButton
                    icon={<FiChevronRight />}
                    size="sm"
                    variant="outline"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage || loading}
                    aria-label="Next page"
                />
                <IconButton
                    icon={<FiChevronsRight />}
                    size="sm"
                    variant="outline"
                    onClick={() => onPageChange(totalPages)}
                    disabled={!hasNextPage || loading}
                    aria-label="Last page"
                />
            </HStack>
        </Flex>
    );
};

const TableHeader = ({ selectedPaymentMethod, onPaymentMethodChange }) => {
    const paymentMethods = [
        { value: 'totalKeseluruhan', label: 'Total Keseluruhan' },
        { value: 'totalTunai', label: 'Total Tunai' },
        { value: 'totalEToll', label: 'Total E-Toll' },
        { value: 'totalFlo', label: 'Total Flo' },
        { value: 'totalKTP', label: 'Total KTP' },
        { value: 'totalETollTunaiFlo', label: 'Total E-Toll+Tunai+Flo' },
    ];

    return (
        <HStack spacing={2} mb={4} flexWrap="wrap">
            {paymentMethods.map((method) => (
                <Button
                    key={method.value}
                    size="sm"
                    variant={selectedPaymentMethod === method.value ? 'solid' : 'outline'}
                    colorScheme={selectedPaymentMethod === method.value ? 'blue' : 'gray'}
                    onClick={() => onPaymentMethodChange(method.value)}
                >
                    {method.label}
                </Button>
            ))}
        </HStack>
    );
};

const LalinTable = ({
    data = [],
    pagination,
    pageNumbers,
    loading,
    error,
    selectedPaymentMethod = 'totalKeseluruhan',
    onPaymentMethodChange,
    onPageChange,
    onPageSizeChange,
    onViewDetail,
}) => {
    if (loading) {
        return <Loading variant="table" rows={10} columns={8} />;
    }

    if (error) {
        return (
            <Box
                p={8}
                textAlign="center"
                bg="red.50"
                borderRadius="md"
                border="1px solid"
                borderColor="red.200"
            >
                <Text color="red.600" fontWeight="medium">
                    Gagal memuat data
                </Text>
                <Text color="red.500" fontSize="sm" mt={1}>
                    {error}
                </Text>
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Box
                p={8}
                textAlign="center"
                bg="gray.50"
                borderRadius="md"
                border="2px dashed"
                borderColor="gray.300"
            >
                <Text color="gray.500" fontWeight="medium">
                    Tidak ada data yang tersedia
                </Text>
                <Text color="gray.400" fontSize="sm" mt={1}>
                    Coba ubah filter atau tanggal untuk melihat data
                </Text>
            </Box>
        );
    }

    return (
        <VStack spacing={4} align="stretch">
     
            <TableHeader
                selectedPaymentMethod={selectedPaymentMethod}
                onPaymentMethodChange={onPaymentMethodChange}
            />

    
            <Box overflowX="auto" bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                        <Tr>
                            <Th>No</Th>
                            <Th>Ruas</Th>
                            <Th>Gerbang</Th>
                            <Th>Gardu</Th>
                            <Th>Tanggal</Th>
                            <Th>Shift</Th>
                            <Th>Golongan</Th>
                            <Th>Metode Pembayaran</Th>
                            <Th>Gol I</Th>
                            <Th>Gol II</Th>
                            <Th>Gol III</Th>
                            <Th>Gol IV</Th>
                            <Th>Gol V</Th>
                            <Th>Total Lalin</Th>
                            <Th>Aksi</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((item, index) => {
                            const rowNumber = formatRowNumber(
                                index,
                                pagination.currentPage,
                                pagination.pageSize
                            );

                            const totalLalin =
                                (item.Tunai || 0) +
                                (item.eMandiri || 0) +
                                (item.eBri || 0) +
                                (item.eBni || 0) +
                                (item.eBca || 0) +
                                (item.eNobu || 0) +
                                (item.eDKI || 0) +
                                (item.eMega || 0) +
                                (item.eFlo || 0);

                            return (
                                <Tr key={item.id} _hover={{ bg: 'gray.50' }}>
                                    <Td fontWeight="medium">{rowNumber}</Td>
                                    <Td>Ruas {item.IdCabang}</Td>
                                    <Td>Gerbang {item.IdGerbang}</Td>
                                    <Td>{item.IdGardu || '-'}</Td>
                                    <Td>{formatDate(item.Tanggal)}</Td>
                                    <Td>
                                        <Badge
                                            size="sm"
                                            colorScheme={
                                                item.Shift === 1 ? 'blue' :
                                                    item.Shift === 2 ? 'green' : 'orange'
                                            }
                                        >
                                            Shift {item.Shift}
                                        </Badge>
                                    </Td>
                                    <Td>Gol {item.Golongan}</Td>
                                    <Td>
                                        <VStack spacing={1} align="start">
                                            {item.Tunai > 0 && (
                                                <Badge size="sm" colorScheme="gray">
                                                    Tunai: {formatNumber(item.Tunai)}
                                                </Badge>
                                            )}
                                            {item.eMandiri > 0 && (
                                                <Badge size="sm" colorScheme="yellow">
                                                    Mandiri: {formatNumber(item.eMandiri)}
                                                </Badge>
                                            )}
                                            {item.eBri > 0 && (
                                                <Badge size="sm" colorScheme="blue">
                                                    BRI: {formatNumber(item.eBri)}
                                                </Badge>
                                            )}
                                            {item.eBni > 0 && (
                                                <Badge size="sm" colorScheme="orange">
                                                    BNI: {formatNumber(item.eBni)}
                                                </Badge>
                                            )}
                                            {item.eBca > 0 && (
                                                <Badge size="sm" colorScheme="blue">
                                                    BCA: {formatNumber(item.eBca)}
                                                </Badge>
                                            )}
                                        </VStack>
                                    </Td>
                                    <Td>{formatNumber(item.Tunai || 0)}</Td>
                                    <Td>{formatNumber(item.eMandiri || 0)}</Td>
                                    <Td>{formatNumber(item.eBri || 0)}</Td>
                                    <Td>{formatNumber(item.eBni || 0)}</Td>
                                    <Td>{formatNumber(item.eBca || 0)}</Td>
                                    <Td fontWeight="semibold">{formatNumber(totalLalin)}</Td>
                                    <Td>
                                        <IconButton
                                            icon={<FiEye />}
                                            size="sm"
                                            variant="ghost"
                                            colorScheme="blue"
                                            onClick={() => onViewDetail && onViewDetail(item)}
                                            aria-label="View detail"
                                        />
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </Box>

         
            <TablePagination
                pagination={pagination}
                pageNumbers={pageNumbers}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                loading={loading}
            />
        </VStack>
    );
};

export default LalinTable;