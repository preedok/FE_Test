import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    GridItem,
    VStack,
    HStack,
    Text,
    Button,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    useDisclosure,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
} from '@chakra-ui/react';
import { FiCalendar, FiFilter, FiRefreshCw } from 'react-icons/fi';
import Layout, { CardContainer } from '@/components/common/Layout';
import BarChart, { MultiBarChart } from '@/components/charts/BarChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import useLalinStore from '@/stores/lalinStore';
import { formatDate, formatNumber } from '@/utils/formatters';
import { CHART_COLORS } from '@/utils/constants';

const StatsCard = ({ label, value, change, changeType = 'increase' }) => {
    return (
        <CardContainer p={6}>
            <Stat>
                <StatLabel fontSize="sm" color="gray.600">
                    {label}
                </StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" color="gray.800">
                    {formatNumber(value)}
                </StatNumber>
                {change && (
                    <StatHelpText mb={0}>
                        <StatArrow type={changeType} />
                        {change}% dari kemarin
                    </StatHelpText>
                )}
            </Stat>
        </CardContainer>
    );
};


const DateFilter = ({ selectedDate, onDateChange, onFilter, loading }) => {
    const [dateInput, setDateInput] = useState(
        selectedDate ? formatDate(selectedDate, 'yyyy-MM-dd') : ''
    );

    const handleDateChange = (e) => {
        setDateInput(e.target.value);
    };

    const handleFilter = () => {
        if (dateInput) {
            onDateChange(new Date(dateInput));
            onFilter();
        }
    };

    const handleRefresh = () => {
        onFilter();
    };

    return (
        <HStack spacing={3}>
            <InputGroup maxW="250px">
                <Input
                    type="date"
                    value={dateInput}
                    onChange={handleDateChange}
                    disabled={loading}
                    bg="white"
                    border="2px solid"
                    borderColor="gray.200"
                    _focus={{
                        borderColor: 'blue.500',
                        boxShadow: '0 0 0 1px blue.500',
                    }}
                />
                <InputRightElement>
                    <FiCalendar color="gray.400" />
                </InputRightElement>
            </InputGroup>

            <Button
                leftIcon={<FiFilter />}
                colorScheme="blue"
                onClick={handleFilter}
                isLoading={loading}
                loadingText="Filter"
                disabled={!dateInput || loading}
            >
                Filter
            </Button>

            <IconButton
                icon={<FiRefreshCw />}
                variant="outline"
                onClick={handleRefresh}
                isLoading={loading}
                aria-label="Refresh data"
            />
        </HStack>
    );
};

const Dashboard = () => {
    const {
        dashboardData,
        selectedDate,
        loading,
        error,
        fetchDashboardData,
        setSelectedDate,
    } = useLalinStore();

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!isInitialized) {
            const today = new Date();
            setSelectedDate(today);
            fetchDashboardData(today);
            setIsInitialized(true);
        }
    }, [isInitialized, setSelectedDate, fetchDashboardData]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleFilter = async () => {
        await fetchDashboardData(selectedDate);
    };

    const paymentMethodChartData = dashboardData?.paymentMethods?.map(item => ({
        name: item.label || item.name,
        value: item.value,
    })) || [];

    const gerbangChartData = dashboardData?.gerbangs?.map(item => ({
        name: item.name,
        value: item.value,
    })) || [];

    const shiftChartData = dashboardData?.shifts?.map(item => ({
        name: item.name,
        value: item.value,
    })) || [];

    const ruasChartData = dashboardData?.ruas?.map(item => ({
        name: item.name,
        value: item.value,
    })) || [];

    const totalLalin = paymentMethodChartData.reduce((sum, item) => sum + item.value, 0);
    const totalGerbang = gerbangChartData.length;
    const totalShift = shiftChartData.length;
    const totalRuas = ruasChartData.length;

    const isLoading = loading === 'loading';

    return (
        <Layout
            title="Dashboard"
            subtitle={`Data lalu lintas untuk ${selectedDate ? formatDate(selectedDate) : 'hari ini'}`}
            headerActions={
                <DateFilter
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                    onFilter={handleFilter}
                    loading={isLoading}
                />
            }
        >
            <VStack spacing={6} p={6}>
              
                <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
                    gap={6}
                    w="100%"
                >
                    <StatsCard
                        label="Total Lalin"
                        value={totalLalin}
                        change={5.2}
                        changeType="increase"
                    />
                    <StatsCard
                        label="Total Gerbang Aktif"
                        value={totalGerbang}
                        change={0}
                        changeType="increase"
                    />
                    <StatsCard
                        label="Shift Operasional"
                        value={totalShift}
                        change={0}
                        changeType="increase"
                    />
                    <StatsCard
                        label="Ruas Jalan"
                        value={totalRuas}
                        change={0}
                        changeType="increase"
                    />
                </Grid>

                <Grid
                    templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
                    gap={6}
                    w="100%"
                >
                    <GridItem>
                        <CardContainer
                            title="Lalin per Metode Pembayaran"
                            subtitle="Distribusi transaksi berdasarkan metode pembayaran"
                        >
                            <BarChart
                                data={paymentMethodChartData}
                                height={350}
                                loading={isLoading}
                                error={error}
                                colors={CHART_COLORS.palette}
                                showTooltip={true}
                                showGrid={true}
                            />
                        </CardContainer>
                    </GridItem>

                    <GridItem>
                        <CardContainer
                            title="Lalin per Gerbang"
                            subtitle="Volume lalu lintas berdasarkan gerbang"
                        >
                            <BarChart
                                data={gerbangChartData}
                                height={350}
                                loading={isLoading}
                                error={error}
                                colors={CHART_COLORS.secondary}
                                showTooltip={true}
                                showGrid={true}
                            />
                        </CardContainer>
                    </GridItem>

                    <GridItem>
                        <CardContainer
                            title="Distribusi per Shift"
                            subtitle="Persentase lalu lintas berdasarkan waktu shift"
                        >
                            <DoughnutChart
                                data={shiftChartData}
                                height={350}
                                loading={isLoading}
                                error={error}
                                colors={CHART_COLORS.tertiary}
                                showLegend={true}
                                showTooltip={true}
                                showPercentage={true}
                            />
                        </CardContainer>
                    </GridItem>

                    <GridItem>
                        <CardContainer
                            title="Distribusi per Ruas/Cabang"
                            subtitle="Persentase lalu lintas berdasarkan ruas jalan"
                        >
                            <DoughnutChart
                                data={ruasChartData}
                                height={350}
                                loading={isLoading}
                                error={error}
                                colors={CHART_COLORS.quaternary}
                                showLegend={true}
                                showTooltip={true}
                                showPercentage={true}
                            />
                        </CardContainer>
                    </GridItem>
                </Grid>

                <CardContainer
                    title="Informasi Tambahan"
                    subtitle="Ringkasan data dan insight"
                    w="100%"
                >
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                        <VStack spacing={3} align="start">
                            <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                Metode Pembayaran Terpopuler
                            </Text>
                            {paymentMethodChartData
                                .sort((a, b) => b.value - a.value)
                                .slice(0, 3)
                                .map((item, index) => (
                                    <HStack key={index} spacing={3} w="100%">
                                        <Box
                                            w={3}
                                            h={3}
                                            bg={CHART_COLORS.palette[index]}
                                            borderRadius="sm"
                                        />
                                        <Text fontSize="sm" flex="1">
                                            {item.name}
                                        </Text>
                                        <Text fontSize="sm" fontWeight="semibold">
                                            {formatNumber(item.value)}
                                        </Text>
                                    </HStack>
                                ))}
                        </VStack>

                        <VStack spacing={3} align="start">
                            <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                Gerbang Tersibuk
                            </Text>
                            {gerbangChartData
                                .sort((a, b) => b.value - a.value)
                                .slice(0, 3)
                                .map((item, index) => (
                                    <HStack key={index} spacing={3} w="100%">
                                        <Box
                                            w={3}
                                            h={3}
                                            bg={CHART_COLORS.secondary[index]}
                                            borderRadius="sm"
                                        />
                                        <Text fontSize="sm" flex="1">
                                            {item.name}
                                        </Text>
                                        <Text fontSize="sm" fontWeight="semibold">
                                            {formatNumber(item.value)}
                                        </Text>
                                    </HStack>
                                ))}
                        </VStack>
                    </Grid>
                </CardContainer>
            </VStack>
        </Layout>
    );
};

export default Dashboard;