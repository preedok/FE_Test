import React, { useState } from 'react';
import {
    Box,
    Flex,
    useDisclosure,
    useBreakpointValue,
    Drawer,
    DrawerContent,
    DrawerOverlay,
} from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';


const MobileSidebar = ({ isOpen, onClose }) => {
    return (
        <Drawer
            autoFocus={false}
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            returnFocusOnClose={false}
            onOverlayClick={onClose}
            size="xs"
        >
            <DrawerOverlay />
            <DrawerContent>
                <Sidebar isOpen={true} />
            </DrawerContent>
        </Drawer>
    );
};


const DesktopSidebar = ({ isOpen }) => {
    return (
        <Box
            display={{ base: 'none', md: 'block' }}
            position="fixed"
            left="0"
            top="0"
            zIndex="1000"
        >
            <Sidebar isOpen={isOpen} />
        </Box>
    );
};


const Layout = ({
    children,
    title = 'Dashboard',
    subtitle,
    headerActions,
    maxWidth = '1400px',
    padding = 6,
}) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { isOpen: isMobileOpen, onOpen: onMobileOpen, onClose: onMobileClose } = useDisclosure();

    const isMobile = useBreakpointValue({ base: true, md: false });
    const sidebarWidth = isSidebarCollapsed ? '80px' : '280px';

    const handleToggleSidebar = () => {
        if (isMobile) {
            onMobileOpen();
        } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    return (
        <Flex minH="100vh" bg="gray.50">
         
            <MobileSidebar
                isOpen={isMobileOpen}
                onClose={onMobileClose}
            />

         
            <DesktopSidebar
                isOpen={!isSidebarCollapsed}
            />

          
            <Box
                flex="1"
                ml={{ base: 0, md: sidebarWidth }}
                transition="margin-left 0.3s ease"
            >
                {/* Header */}
                <Header
                    onToggleSidebar={handleToggleSidebar}
                    title={title}
                    subtitle={subtitle}
                    actions={headerActions}
                />

              
                <Box
                    as="main"
                    p={padding}
                    maxW={maxWidth}
                    mx="auto"
                    minH="calc(100vh - 80px)"
                >
                    <Box
                        bg="white"
                        borderRadius="xl"
                        shadow="sm"
                        border="1px solid"
                        borderColor="gray.200"
                        overflow="hidden"
                        className="animate-fade-in"
                    >
                        {children}
                    </Box>
                </Box>
            </Box>
        </Flex>
    );
};


export const PageContainer = ({
    children,
    title,
    subtitle,
    actions,
    maxWidth = 'full',
    p = 6
}) => {
    return (
        <Box maxW={maxWidth} mx="auto" p={p}>
            {(title || subtitle || actions) && (
                <Flex
                    justify="space-between"
                    align="center"
                    mb={6}
                    flexWrap="wrap"
                    gap={4}
                >
                    <Box>
                        {title && (
                            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                {title}
                            </Text>
                        )}
                        {subtitle && (
                            <Text fontSize="md" color="gray.600" mt={1}>
                                {subtitle}
                            </Text>
                        )}
                    </Box>

                    {actions && (
                        <Flex gap={3} flexWrap="wrap">
                            {actions}
                        </Flex>
                    )}
                </Flex>
            )}

            {children}
        </Box>
    );
};


export const CardContainer = ({
    children,
    title,
    subtitle,
    actions,
    p = 6,
    ...props
}) => {
    return (
        <Box
            bg="white"
            borderRadius="lg"
            shadow="sm"
            border="1px solid"
            borderColor="gray.200"
            overflow="hidden"
            {...props}
        >
            {(title || subtitle || actions) && (
                <Flex
                    justify="space-between"
                    align="center"
                    p={p}
                    borderBottomWidth="1px"
                    borderColor="gray.200"
                    bg="gray.50"
                >
                    <Box>
                        {title && (
                            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                                {title}
                            </Text>
                        )}
                        {subtitle && (
                            <Text fontSize="sm" color="gray.600" mt={1}>
                                {subtitle}
                            </Text>
                        )}
                    </Box>

                    {actions && (
                        <Flex gap={2}>
                            {actions}
                        </Flex>
                    )}
                </Flex>
            )}

            <Box p={p}>
                {children}
            </Box>
        </Box>
    );
};

export default Layout;