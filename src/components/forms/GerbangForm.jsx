import React, { useState, useEffect } from 'react';
import {
    VStack,
    HStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { validateGerbangForm } from '@/utils/validators';
import { LOADING_STATES } from '@/utils/constants';
import { ButtonLoading } from '@/components/common/Loading';

const GerbangForm = ({
    initialData = null,
    mode = 'create', 
    onSubmit,
    onCancel,
    loading = LOADING_STATES.IDLE,
    error = null,
}) => {
    const [formData, setFormData] = useState({
        NamaGerbang: '',
        NamaCabang: '',
        IdCabang: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                NamaGerbang: initialData.NamaGerbang || '',
                NamaCabang: initialData.NamaCabang || '',
                IdCabang: initialData.IdCabang?.toString() || '',
            });
        } else {
            setFormData({
                NamaGerbang: '',
                NamaCabang: '',
                IdCabang: '',
            });
        }
    }, [initialData]);

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

        const { isValid, errors: validationErrors } = validateGerbangForm(formData);

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        const submitData = {
            ...formData,
            IdCabang: parseInt(formData.IdCabang),
        };

        if (mode === 'edit' && initialData?.id) {
            submitData.id = initialData.id;
        }

        setErrors({});
        onSubmit(submitData);
    };

    const isLoading = loading === LOADING_STATES.LOADING;
    const isViewMode = mode === 'view';

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
                {error && (
                    <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        <Text fontSize="sm">{error}</Text>
                    </Alert>
                )}

                <FormControl isInvalid={!!errors.IdCabang} isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium">
                        ID Cabang
                    </FormLabel>
                    <Input
                        type="number"
                        value={formData.IdCabang}
                        onChange={handleInputChange('IdCabang')}
                        placeholder="Masukkan ID cabang"
                        disabled={isLoading || isViewMode}
                        bg={isViewMode ? 'gray.50' : 'white'}
                    />
                    {errors.IdCabang && (
                        <Text fontSize="xs" color="red.500" mt={1}>
                            {errors.IdCabang}
                        </Text>
                    )}
                </FormControl>

             
                <FormControl isInvalid={!!errors.NamaGerbang} isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium">
                        Nama Gerbang
                    </FormLabel>
                    <Input
                        type="text"
                        value={formData.NamaGerbang}
                        onChange={handleInputChange('NamaGerbang')}
                        placeholder="Masukkan nama gerbang"
                        disabled={isLoading || isViewMode}
                        bg={isViewMode ? 'gray.50' : 'white'}
                    />
                    {errors.NamaGerbang && (
                        <Text fontSize="xs" color="red.500" mt={1}>
                            {errors.NamaGerbang}
                        </Text>
                    )}
                </FormControl>

           
                <FormControl isInvalid={!!errors.NamaCabang} isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium">
                        Nama Cabang
                    </FormLabel>
                    <Input
                        type="text"
                        value={formData.NamaCabang}
                        onChange={handleInputChange('NamaCabang')}
                        placeholder="Masukkan nama cabang"
                        disabled={isLoading || isViewMode}
                        bg={isViewMode ? 'gray.50' : 'white'}
                    />
                    {errors.NamaCabang && (
                        <Text fontSize="xs" color="red.500" mt={1}>
                            {errors.NamaCabang}
                        </Text>
                    )}
                </FormControl>

            
                <HStack spacing={3} w="100%" justify="flex-end">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {isViewMode ? 'Tutup' : 'Batal'}
                    </Button>

                    {!isViewMode && (
                        <Button
                            type="submit"
                            colorScheme="blue"
                            isLoading={isLoading}
                            loadingText={mode === 'create' ? 'Menyimpan...' : 'Memperbarui...'}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ButtonLoading />
                            ) : (
                                mode === 'create' ? 'Simpan' : 'Perbarui'
                            )}
                        </Button>
                    )}
                </HStack>
            </VStack>
        </form>
    );
};

export default GerbangForm;