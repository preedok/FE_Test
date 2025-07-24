
import React from 'react';
import {
    Box,
    Flex,
    HStack,
    VStack,
    Text,
    Button,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    IconButton,
    useColorModeValue,
    Badge,
    Tooltip,
} from '@chakra-ui/react';
import {
    FiMenu,
    FiBell,
    FiSettings,
    FiLogOut,
    FiUser,
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { formatDateTime } from '@/utils/formatters';

const NotificationMenu = () => {
    const notifications = [
        {
            id: 1,
            title: 'Data lalin berhasil diperbarui',
            message: 'Laporan per hari telah diperbarui untuk tanggal hari ini',
            time: new Date(),
            read: false,
        },
        {
            id: 2,
            title: 'Sistem maintenance',
            message: 'Sistem akan menjalani maintenance pada malam hari',
            time: new Date(Date.now() - 3600000),
            read: true,
        },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                icon={<FiBell />}
                variant="ghost"
                size="md"
                aria-label="Notifications"
                position="relative"
            >
                {unreadCount > 0 && (
                    <Badge
                        position="absolute"
                        top="0"
                        right="0"
                        transform="translate(25%, -25%)"
                        colorScheme="red"
                        borderRadius="full"
                        fontSize="xs"
                        w="18px"
                        h="18px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {unreadCount}
                    </Badge>
                )}
            </MenuButton>

            <MenuList maxW="350px" shadow="lg">
                <Box px={4} py={2} borderBottomWidth="1px">
                    <Text fontWeight="semibold" fontSize="sm">Notifikasi</Text>
                </Box>

                {notifications.length === 0 ? (
                    <Box px={4} py={6} textAlign="center">
                        <Text fontSize="sm" color="gray.500">Tidak ada notifikasi</Text>
                    </Box>
                ) : (
                    notifications.map(notification => (
                        <MenuItem
                            key={notification.id}
                            py={3}
                            px={4}
                            borderBottomWidth="1px"
                            bg={notification.read ? 'transparent' : 'blue.50'}
                            _last={{ borderBottomWidth: 0 }}
                            display="block"
                        >
                            <VStack spacing={1} align="start" w="100%">
                                <HStack justify="space-between" w="100%">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color={notification.read ? 'gray.700' : 'blue.700'}
                                    >
                                        {notification.title}
                                    </Text>
                                    {!notification.read && (
                                        <Box w={2} h={2} bg="blue.500" borderRadius="full" />
                                    )}
                                </HStack>
                                <Text fontSize="xs" color="gray.600" noOfLines={2}>
                                    {notification.message}
                                </Text>
                                <Text fontSize="xs" color="gray.400">
                                    {formatDateTime(notification.time)}
                                </Text>
                            </VStack>
                        </MenuItem>
                    ))
                )}

                <Box px={4} py={2} borderTopWidth="1px">
                    <Button size="sm" variant="ghost" w="100%" fontSize="xs">
                        Lihat semua notifikasi
                    </Button>
                </Box>
            </MenuList>
        </Menu>
    );
};

const UserMenu = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Menu>
            <MenuButton as={Button} variant="ghost" size="sm">
                <HStack spacing={3}>
                    <Avatar
                        size="sm"
                        name={user?.username || 'User'}
                        bg="blue.500"
                        color="white"
                    />
                    <VStack spacing={0} align="start" display={{ base: 'none', md: 'flex' }}>
                        <Text fontSize="sm" fontWeight="medium">
                            {user?.username || 'User'}
                        </Text>
                        <Text fontSize="xs" color="gray.500">Administrator</Text>
                    </VStack>
                </HStack>
            </MenuButton>

            <MenuList shadow="lg" minW="200px">
                <MenuItem icon={<FiUser />} fontSize="sm">
                    Profil Saya
                </MenuItem>
                <MenuItem icon={<FiSettings />} fontSize="sm">
                    Pengaturan
                </MenuItem>
                <MenuDivider />
                <MenuItem
                    icon={<FiLogOut />}
                    fontSize="sm"
                    onClick={handleLogout}
                    color="red.500"
                    _hover={{ bg: 'red.50' }}
                >
                    Keluar
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

const Header = ({ onToggleSidebar, title = 'Dashboard', subtitle, actions }) => {
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box
            as="header"
            bg={bg}
            borderBottomWidth="1px"
            borderColor={borderColor}
            px={6}
            py={4}
            position="sticky"
            top="0"
            zIndex="100"
            shadow="sm"
        >
            <Flex align="center" justify="space-between">
          
                <HStack spacing={4}>
                    {onToggleSidebar && (
                        <Tooltip label="Toggle Sidebar" placement="bottom">
                            <IconButton
                                icon={<FiMenu />}
                                variant="ghost"
                                size="md"
                                onClick={onToggleSidebar}
                                aria-label="Toggle Sidebar"
                            />
                        </Tooltip>
                    )}
                    <VStack spacing={0} align="start">
                        <Text fontSize="xl" fontWeight="bold" color="gray.800">
                            {title}
                        </Text>
                        {subtitle && (
                            <Text fontSize="sm" color="gray.500">
                                {subtitle}
                            </Text>
                        )}
                    </VStack>
                </HStack>

                <HStack spacing={3}>
                    {actions}
                    <NotificationMenu />
                    <UserMenu />
                </HStack>
            </Flex>
        </Box>
    );
};

export default Header;
