import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Icon,
    Flex,
    Collapse,
    useDisclosure,
    Badge,
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiBarChart3,
    FiSettings,
    FiChevronDown,
    FiChevronRight,
} from 'react-icons/fi';
import { ROUTES } from '@/utils/constants';


const menuItems = [
    {
        label: 'Dashboard',
        icon: FiHome,
        path: ROUTES.DASHBOARD,
        exact: true,
    },
    {
        label: 'Laporan Lalin',
        icon: FiBarChart3,
        children: [
            {
                label: 'Laporan Per Hari',
                path: ROUTES.LALIN_REPORT,
            },
        ],
    },
    {
        label: 'Master Gerbang',
        icon: FiSettings,
        path: ROUTES.MASTER_GERBANG,
    },
];


const SidebarMenuItem = ({ item, level = 0 }) => {
    const location = useLocation();
    const { isOpen, onToggle } = useDisclosure();

    const isActive = item.exact
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path || '');

    const hasChildren = item.children && item.children.length > 0;

    const handleClick = () => {
        if (hasChildren) {
            onToggle();
        }
    };

    const menuItemContent = (
        <HStack
            spacing={3}
            py={3}
            px={4}
            borderRadius="lg"
            cursor="pointer"
            transition="all 0.2s"
            bg={isActive ? 'blue.500' : 'transparent'}
            color={isActive ? 'white' : 'gray.700'}
            _hover={{
                bg: isActive ? 'blue.600' : 'gray.100',
                transform: 'translateX(4px)',
            }}
            onClick={handleClick}
            ml={level * 4}
        >
            {item.icon && (
                <Icon
                    as={item.icon}
                    boxSize={5}
                    color={isActive ? 'white' : 'gray.500'}
                />
            )}

            <Text
                fontSize="sm"
                fontWeight={isActive ? 'semibold' : 'medium'}
                flex="1"
            >
                {item.label}
            </Text>

            {item.badge && (
                <Badge
                    size="sm"
                    colorScheme={isActive ? 'white' : 'blue'}
                    variant={isActive ? 'solid' : 'subtle'}
                >
                    {item.badge}
                </Badge>
            )}

            {hasChildren && (
                <Icon
                    as={isOpen ? FiChevronDown : FiChevronRight}
                    boxSize={4}
                    color={isActive ? 'white' : 'gray.400'}
                    transition="transform 0.2s"
                />
            )}
        </HStack>
    );

    return (
        <Box>
            {item.path && !hasChildren ? (
                <NavLink to={item.path}>
                    {menuItemContent}
                </NavLink>
            ) : (
                menuItemContent
            )}

            {hasChildren && (
                <Collapse in={isOpen} animateOpacity>
                    <VStack spacing={1} align="stretch" mt={1}>
                        {item.children.map((child, index) => (
                            <SidebarMenuItem
                                key={index}
                                item={child}
                                level={level + 1}
                            />
                        ))}
                    </VStack>
                </Collapse>
            )}
        </Box>
    );
};


const Sidebar = ({ isOpen = true }) => {
    return (
        <Box
            w={isOpen ? "280px" : "80px"}
            h="100vh"
            bg="white"
            borderRightWidth="1px"
            borderColor="gray.200"
            position="fixed"
            left="0"
            top="0"
            zIndex="1000"
            transition="all 0.3s"
            overflowY="auto"
            boxShadow="sm"
        >
          
            <Flex
                align="center"
                justify={isOpen ? "flex-start" : "center"}
                p={6}
                borderBottomWidth="1px"
                borderColor="gray.100"
                bg="gradient-to-r from-blue-600 to-purple-600"
                color="white"
                minH="80px"
            >
                {isOpen ? (
                    <HStack spacing={3}>
                        <Box
                            w={10}
                            h={10}
                            bg="white"
                            borderRadius="lg"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color="blue.600"
                            >
                                L
                            </Text>
                        </Box>
                        <VStack spacing={0} align="start">
                            <Text fontSize="lg" fontWeight="bold">
                                Lalin Dashboard
                            </Text>
                            <Text fontSize="xs" opacity="0.8">
                                Traffic Management
                            </Text>
                        </VStack>
                    </HStack>
                ) : (
                    <Box
                        w={10}
                        h={10}
                        bg="white"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color="blue.600"
                        >
                            L
                        </Text>
                    </Box>
                )}
            </Flex>

           
            <VStack
                spacing={2}
                align="stretch"
                p={4}
                mt={4}
            >
                {menuItems.map((item, index) => (
                    <SidebarMenuItem
                        key={index}
                        item={item}
                    />
                ))}
            </VStack>

            
            {isOpen && (
                <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    right="0"
                    p={4}
                    borderTopWidth="1px"
                    borderColor="gray.100"
                    bg="gray.50"
                >
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                        © 2024 Lalin Dashboard
                    </Text>
                </Box>
            )}
        </Box>
    );
};

export default Sidebar;