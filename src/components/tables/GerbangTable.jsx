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
    Flex,
    Spacer,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import {
    FiChevronLeft,
    FiChevronRight,
    FiChevronsLeft,
    FiChevronsRight,
    FiEdit,
    FiTrash2,
    FiEye,
} from 'react-icons/fi';
import { formatRowNumber } from '@/utils/formatters';
import { TABLE_PAGE_SIZES } from '@/utils/constants';
import Loading from '@/components/common/Loading';

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, gerbang, loading }) => {
    const cancelRef = React.useRef();

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Hapus Gerbang
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Apakah Anda yakin ingin menghapus gerbang{' '}
                        <Text as="span" fontWeight="bold">
                            {gerbang?.NamaGerbang}
                        </Text>
                        ? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose} disabled={loading}>
                            Batal
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={onConfirm}
                            ml={3}
                            isLoading={loading}
                            loadingText="Menghapus..."
                        >
                            Hapus
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};


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
                    dari {totalCount} data
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

const GerbangTable = ({
    data = [],
    pagination,
    pageNumbers,
    loading,
    error,
    onPageChange,
    onPageSizeChange,
    onEdit,
    onDelete,
    onView,
}) => {
    const [selectedGerbang, setSelectedGerbang] = React.useState(null);
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const handleDeleteClick = (gerbang) => {
        setSelectedGerbang(gerbang);
        onDeleteOpen();
    };

    const handleDeleteConfirm = () => {
        if (selectedGerbang && onDelete) {
            onDelete(selectedGerbang.id, selectedGerbang.IdCabang);
        }
        onDeleteClose();
        setSelectedGerbang(null);
    };

    const handleDeleteCancel = () => {
        onDeleteClose();
        setSelectedGerbang(null);
    };

    if (loading) {
        return <Loading variant="table" rows={5} columns={5} />;
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
                    Tidak ada data gerbang
                </Text>
                <Text color="gray.400" fontSize="sm" mt={1}>
                    Klik tombol "Tambah" untuk menambahkan gerbang baru
                </Text>
            </Box>
        );
    }

    return (
        <VStack spacing={4} align="stretch">

            <Box overflowX="auto" bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                        <Tr>
                            <Th>No</Th>
                            <Th>Ruas</Th>
                            <Th>Gerbang</Th>
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

                            return (
                                <Tr key={item.id} _hover={{ bg: 'gray.50' }}>
                                    <Td fontWeight="medium">{rowNumber}</Td>
                                    <Td>{item.NamaCabang}</Td>
                                    <Td>{item.NamaGerbang}</Td>
                                    <Td>
                                        <HStack spacing={1}>
                                            <IconButton
                                                icon={<FiEye />}
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="blue"
                                                onClick={() => onView && onView(item)}
                                                aria-label="View gerbang"
                                                title="Lihat detail"
                                            />
                                            <IconButton
                                                icon={<FiEdit />}
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="orange"
                                                onClick={() => onEdit && onEdit(item)}
                                                aria-label="Edit gerbang"
                                                title="Edit gerbang"
                                            />
                                            <IconButton
                                                icon={<FiTrash2 />}
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="red"
                                                onClick={() => handleDeleteClick(item)}
                                                aria-label="Delete gerbang"
                                                title="Hapus gerbang"
                                            />
                                        </HStack>
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


            <DeleteConfirmDialog
                isOpen={isDeleteOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                gerbang={selectedGerbang}
                loading={loading}
            />
        </VStack>
    );
};

export default GerbangTable;