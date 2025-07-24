import React from 'react';
import { Box, Spinner, Text, VStack, HStack } from '@chakra-ui/react';


export const LoadingSpinner = ({
    size = 'md',
    color = 'blue.500',
    thickness = '4px',
    speed = '0.65s'
}) => {
    return (
        <Spinner
            size={size}
            color={color}
            thickness={thickness}
            speed={speed}
        />
    );
};


export const PageLoading = ({ message = 'Memuat...' }) => {
    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor="rgba(255, 255, 255, 0.8)"
            backdropFilter="blur(4px)"
            zIndex="9999"
        >
            <VStack spacing={4}>
                <LoadingSpinner size="xl" />
                <Text fontSize="lg" color="gray.600" fontWeight="medium">
                    {message}
                </Text>
            </VStack>
        </Box>
    );
};


export const InlineLoading = ({
    message = 'Memuat...',
    size = 'sm',
    justify = 'center',
    spacing = 3
}) => {
    return (
        <HStack spacing={spacing} justify={justify} py={4}>
            <LoadingSpinner size={size} />
            <Text fontSize="sm" color="gray.600">
                {message}
            </Text>
        </HStack>
    );
};


export const ButtonLoading = ({ size = 'sm', color = 'white' }) => {
    return <LoadingSpinner size={size} color={color} />;
};


export const TableLoading = ({ rows = 5, columns = 4 }) => {
    return (
        <Box w="100%">
            {Array.from({ length: rows }).map((_, index) => (
                <HStack key={index} spacing={4} py={3} borderBottomWidth="1px">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Box
                            key={colIndex}
                            height="20px"
                            flex="1"
                            backgroundColor="gray.200"
                            borderRadius="md"
                            className="skeleton"
                        />
                    ))}
                </HStack>
            ))}
        </Box>
    );
};


export const CardLoading = ({ height = '200px' }) => {
    return (
        <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            backgroundColor="white"
            boxShadow="sm"
        >
            <VStack spacing={4} align="stretch">
                <Box height="20px" backgroundColor="gray.200" borderRadius="md" className="skeleton" />
                <Box height="60px" backgroundColor="gray.100" borderRadius="md" className="skeleton" />
                <HStack>
                    <Box height="16px" flex="1" backgroundColor="gray.200" borderRadius="md" className="skeleton" />
                    <Box height="16px" flex="1" backgroundColor="gray.200" borderRadius="md" className="skeleton" />
                </HStack>
            </VStack>
        </Box>
    );
};


export const ChartLoading = ({ height = '300px' }) => {
    return (
        <Box
            height={height}
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor="gray.50"
            borderRadius="lg"
            border="2px dashed"
            borderColor="gray.200"
        >
            <VStack spacing={3}>
                <LoadingSpinner size="lg" />
                <Text fontSize="sm" color="gray.500">
                    Memuat grafik...
                </Text>
            </VStack>
        </Box>
    );
};


const Loading = ({
    variant = 'inline',
    ...props
}) => {
    const variants = {
        page: PageLoading,
        inline: InlineLoading,
        spinner: LoadingSpinner,
        button: ButtonLoading,
        table: TableLoading,
        card: CardLoading,
        chart: ChartLoading,
    };

    const Component = variants[variant] || InlineLoading;
    return <Component {...props} />;
};

export default Loading;