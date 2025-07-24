import React, { useEffect } from 'react';
import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    useColorModeValue,
    Container,
} from '@chakra-ui/react';
import { useAuth, useRedirectIfAuthenticated } from '@/hooks/useAuth';
import LoginForm from '@/components/forms/LoginForm';
import { PageLoading } from '@/components/common/Loading';

const Login = () => {
    const { login, loading, error } = useAuth();
    const shouldRender = useRedirectIfAuthenticated();

    const bgGradient = useColorModeValue(
        'linear(to-br, blue.400, purple.600)',
        'linear(to-br, blue.600, purple.800)'
    );

    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.700', 'gray.200');

    const handleLogin = async (credentials) => {
        await login(credentials);
    };
    if (!shouldRender) {
        return <PageLoading message="Mengalihkan ke dashboard..." />;
    }

    return (
        <Box
            minH="100vh"
            bgGradient={bgGradient}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
            <Container maxW="6xl">
                <Flex
                    direction={{ base: 'column', lg: 'row' }}
                    align="center"
                    justify="center"
                    gap={8}
                    minH="80vh"
                >
               
                    <VStack
                        flex="1"
                        spacing={8}
                        align={{ base: 'center', lg: 'flex-start' }}
                        textAlign={{ base: 'center', lg: 'left' }}
                        color="white"
                        maxW={{ base: 'full', lg: '500px' }}
                    >
                
                        <HStack spacing={4}>
                            <Box
                                w={16}
                                h={16}
                                bg="white"
                                borderRadius="xl"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                shadow="lg"
                            >
                                <Text
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    bgGradient="linear(to-r, blue.400, purple.600)"
                                    bgClip="text"
                                >
                                    L
                                </Text>
                            </Box>
                            <VStack spacing={0} align="start">
                                <Text fontSize="3xl" fontWeight="bold">
                                    Lalin Dashboard
                                </Text>
                                <Text fontSize="lg" opacity="0.9">
                                    Traffic Management System
                                </Text>
                            </VStack>
                        </HStack>

                  
                        <VStack spacing={4} align={{ base: 'center', lg: 'flex-start' }}>
                            <Text fontSize="xl" fontWeight="medium">
                                Sistem Manajemen Lalu Lintas Terpadu
                            </Text>
                            <Text fontSize="lg" opacity="0.8" lineHeight="tall">
                                Dashboard komprehensif untuk monitoring dan analisis data lalu lintas.
                                Akses laporan real-time, kelola data gerbang, dan dapatkan insights
                                yang mendalam untuk pengambilan keputusan yang lebih baik.
                            </Text>
                        </VStack>

              
                        <VStack spacing={3} align={{ base: 'center', lg: 'flex-start' }}>
                            <HStack spacing={3}>
                                <Box w={2} h={2} bg="white" borderRadius="full" />
                                <Text>Dashboard Real-time</Text>
                            </HStack>
                            <HStack spacing={3}>
                                <Box w={2} h={2} bg="white" borderRadius="full" />
                                <Text>Laporan Komprehensif</Text>
                            </HStack>
                            <HStack spacing={3}>
                                <Box w={2} h={2} bg="white" borderRadius="full" />
                                <Text>Manajemen Data Gerbang</Text>
                            </HStack>
                            <HStack spacing={3}>
                                <Box w={2} h={2} bg="white" borderRadius="full" />
                                <Text>Analisis Visual</Text>
                            </HStack>
                        </VStack>
                    </VStack>

                   
                    <Box
                        flex="1"
                        maxW={{ base: 'full', lg: '450px' }}
                        w="100%"
                    >
                        <Box
                            bg={cardBg}
                            p={8}
                            borderRadius="2xl"
                            shadow="2xl"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                            backdropFilter="blur(10px)"
                        >
                            <VStack spacing={8}>
                           
                                <VStack spacing={2}>
                                    <Text
                                        fontSize="2xl"
                                        fontWeight="bold"
                                        color={textColor}
                                    >
                                        Selamat Datang
                                    </Text>
                                    <Text
                                        fontSize="md"
                                        color="gray.500"
                                        textAlign="center"
                                    >
                                        Masuk ke akun Anda untuk mengakses dashboard
                                    </Text>
                                </VStack>

                        
                                <LoginForm
                                    onSubmit={handleLogin}
                                    loading={loading}
                                    error={error}
                                />

                               
                                <VStack spacing={2} mt={6}>
                                    <Text fontSize="xs" color="gray.500" textAlign="center">
                                        Dengan masuk, Anda menyetujui{' '}
                                        <Text as="span" color="blue.500" cursor="pointer">
                                            syarat dan ketentuan
                                        </Text>{' '}
                                        yang berlaku
                                    </Text>
                                </VStack>
                            </VStack>
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default Login;