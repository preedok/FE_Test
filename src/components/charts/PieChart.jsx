import React from 'react';
import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Box, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { formatNumber, formatPercentage } from '@/utils/formatters';
import { CHART_COLORS } from '@/utils/constants';
import Loading from '@/components/common/Loading';


const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <Box
                bg="white"
                p={3}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                shadow="lg"
            >
                <VStack spacing={1} align="start">
                    <Text fontSize="sm" fontWeight="semibold">
                        {data.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        Jumlah: {formatNumber(data.value)}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        Persentase: {formatPercentage(data.value, data.payload.total)}
                    </Text>
                </VStack>
            </Box>
        );
    }
    return null;
};


const CustomLegend = ({ payload, showPercentage = false }) => {
    if (!payload || payload.length === 0) return null;

    const total = payload.reduce((sum, entry) => sum + entry.payload.value, 0);

    return (
        <VStack spacing={2} align="start" mt={4}>
            {payload.map((entry, index) => (
                <HStack key={index} spacing={3}>
                    <Box
                        w={3}
                        h={3}
                        bg={entry.color}
                        borderRadius="sm"
                    />
                    <Text fontSize="sm" color="gray.700" flex="1">
                        {entry.value}
                    </Text>
                    <Badge variant="subtle" colorScheme="gray" fontSize="xs">
                        {formatNumber(entry.payload.value)}
                        {showPercentage && ` (${formatPercentage(entry.payload.value, total)})`}
                    </Badge>
                </HStack>
            ))}
        </VStack>
    );
};


const PieChart = ({
    data = [],
    dataKey = 'value',
    nameKey = 'name',
    title,
    subtitle,
    height = 300,
    loading = false,
    error = null,
    colors = CHART_COLORS.palette,
    showLegend = true,
    showTooltip = true,
    showPercentage = true,
    innerRadius = 0,
    outerRadius,
    startAngle = 90,
    endAngle = -270,
    cx = '50%',
    cy = '50%',
    ...props
}) => {
    if (loading) {
        return <Loading variant="chart" height={`${height}px`} />;
    }

    if (error) {
        return (
            <Box
                height={`${height}px`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="lg"
                border="2px dashed"
                borderColor="red.200"
                bg="red.50"
            >
                <VStack spacing={2}>
                    <Text fontSize="sm" color="red.600" fontWeight="medium">
                        Gagal memuat grafik
                    </Text>
                    <Text fontSize="xs" color="red.500">
                        {error}
                    </Text>
                </VStack>
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Box
                height={`${height}px`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="lg"
                border="2px dashed"
                borderColor="gray.200"
                bg="gray.50"
            >
                <Text fontSize="sm" color="gray.500">
                    Tidak ada data untuk ditampilkan
                </Text>
            </Box>
        );
    }

    const total = data.reduce((sum, item) => sum + item[dataKey], 0);
    const processedData = data.map(item => ({
        ...item,
        total,
    }));

    return (
        <Box {...props}>
            {(title || subtitle) && (
                <VStack spacing={1} align="start" mb={4}>
                    {title && (
                        <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                            {title}
                        </Text>
                    )}
                    {subtitle && (
                        <Text fontSize="sm" color="gray.600">
                            {subtitle}
                        </Text>
                    )}
                </VStack>
            )}

            <ResponsiveContainer width="100%" height={height}>
                <RechartsPieChart>
                    <Pie
                        data={processedData}
                        cx={cx}
                        cy={cy}
                        startAngle={startAngle}
                        endAngle={endAngle}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        dataKey={dataKey}
                        nameKey={nameKey}
                        stroke="#fff"
                        strokeWidth={2}
                    >
                        {processedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                            />
                        ))}
                    </Pie>

                    {showTooltip && (
                        <Tooltip content={<CustomTooltip />} />
                    )}

                    {showLegend && (
                        <Legend
                            content={<CustomLegend showPercentage={showPercentage} />}
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                        />
                    )}
                </RechartsPieChart>
            </ResponsiveContainer>
        </Box>
    );
};


export const DoughnutChart = ({
    innerRadius = 60,
    ...props
}) => {
    return (
        <PieChart
            innerRadius={innerRadius}
            {...props}
        />
    );
};


export const SemiCircleChart = ({
    startAngle = 180,
    endAngle = 0,
    cx = '50%',
    cy = '80%',
    ...props
}) => {
    return (
        <PieChart
            startAngle={startAngle}
            endAngle={endAngle}
            cx={cx}
            cy={cy}
            {...props}
        />
    );
};

export default PieChart;