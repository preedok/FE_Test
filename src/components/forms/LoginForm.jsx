import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    VStack,
    Text,
    Alert,
    AlertIcon,
    useColorModeValue,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { validateLoginForm } from '@/utils/validators';
import { LOADING_STATES } from '@/utils/constants';
import { ButtonLoading } from '@/components/common/Loading';


const LoginForm = ({ onSubmit, loading = LOADING_STATES.IDLE, error = null }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const inputBg = useColorModeValue('white', 'gray.800');
    const inputBorder = useColorModeValue('gray.300', 'gray.600');

    const handleInputChange = (field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));


        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

   
        const { isValid, errors: validationErrors } = validateLoginForm(formData);

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }


        setErrors({});
        onSubmit(formData);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isLoading = loading === LOADING_STATES.LOADING;

    return (
        <Box
            as="form"
            onSubmit={handleSubmit}
            w="100%"
            maxW="400px"
            mx="auto"
        >
            <VStack spacing={6}>
         
                {error && (
                    <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        <Text fontSize="sm">{error}</Text>
                    </Alert>
                )}

      
                <FormControl isInvalid={!!errors.username} isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                        Username
                    </FormLabel>
                    <Input
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange('username')}
                        placeholder="Masukkan username"
                        bg={inputBg}
                        border="2px solid"
                        borderColor={errors.username ? 'red.300' : inputBorder}
                        _hover={{
                            borderColor: errors.username ? 'red.400' : 'blue.300',
                        }}
                        _focus={{
                            borderColor: errors.username ? 'red.500' : 'blue.500',
                            boxShadow: errors.username
                                ? '0 0 0 1px red.500'
                                : '0 0 0 1px blue.500',
                        }}
                        size="lg"
                        disabled={isLoading}
                    />
                    {errors.username && (
                        <Text fontSize="xs" color="red.500" mt={1}>
                            {errors.username}
                        </Text>
                    )}
                </FormControl>

             
                <FormControl isInvalid={!!errors.password} isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                        Password
                    </FormLabel>
                    <InputGroup size="lg">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleInputChange('password')}
                            placeholder="Masukkan password"
                            bg={inputBg}
                            border="2px solid"
                            borderColor={errors.password ? 'red.300' : inputBorder}
                            _hover={{
                                borderColor: errors.password ? 'red.400' : 'blue.300',
                            }}
                            _focus={{
                                borderColor: errors.password ? 'red.500' : 'blue.500',
                                boxShadow: errors.password
                                    ? '0 0 0 1px red.500'
                                    : '0 0 0 1px blue.500',
                            }}
                            pr="12"
                            disabled={isLoading}
                        />
                        <InputRightElement width="12">
                            <IconButton
                                h="1.75rem"
                                size="sm"
                                variant="ghost"
                                onClick={togglePasswordVisibility}
                                icon={showPassword ? <FiEyeOff /> : <FiEye />}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                disabled={isLoading}
                            />
                        </InputRightElement>
                    </InputGroup>
                    {errors.password && (
                        <Text fontSize="xs" color="red.500" mt={1}>
                            {errors.password}
                        </Text>
                    )}
                </FormControl>

      
                <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    w="100%"
                    isLoading={isLoading}
                    loadingText="Masuk..."
                    disabled={isLoading}
                    bg="blue.500"
                    _hover={{
                        bg: 'blue.600',
                        transform: 'translateY(-1px)',
                        boxShadow: 'lg',
                    }}
                    _active={{
                        transform: 'translateY(0)',
                    }}
                    transition="all 0.2s"
                    fontWeight="semibold"
                >
                    {isLoading ? <ButtonLoading /> : 'Masuk'}
                </Button>
            </VStack>
        </Box>
    );
};

export default LoginForm;