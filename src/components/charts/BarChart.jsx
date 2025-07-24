import React from 'react';
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Box, Text, VStack } from '@chakra-ui/react';
import { formatNumber } from '@/utils/formatters';
import { CHART_COLORS } from '@/utils/constants';
import Loading from '@/components/common/Loading';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Box
                bg="white"
                p={3}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                shadow="lg"
            >
                <Text fontSize="sm" fontWeight="semibold" mb={2}>
                    {label}
                </Text>
                {payload.map((entry, index) => (
                    <Text
                        key={index}
                        fontSize="sm"
                        color={entry.color}
                    >
                        {entry.name}: {formatNumber(entry.value)}
                    </Text>
                ))}
            </Box>
        );
    }
    return null;
};

const BarChart = ({
    data = [],
    dataKey = 'value',
    nameKey = 'name',
    title,
    subtitle,
    height = 300,
    loading = false,
    error = null,
    colors = CHART_COLORS.primary,
    showLegend = false,
    showGrid = true,
    showTooltip = true,
    orientation = 'vertical', 
    barSize,
    margin = { top: 20, right: 30, left: 20, bottom: 5 },
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
                <RechartsBarChart
                    data={data}
                    margin={margin}
                    layout={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
                >
                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                        />
                    )}

                    <XAxis
                        dataKey={orientation === 'horizontal' ? dataKey : nameKey}
                        type={orientation === 'horizontal' ? 'number' : 'category'}
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={orientation === 'horizontal' ? formatNumber : undefined}
                    />

                    <YAxis
                        dataKey={orientation === 'horizontal' ? nameKey : dataKey}
                        type={orientation === 'horizontal' ? 'category' : 'number'}
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={orientation === 'vertical' ? formatNumber : undefined}
                        width={orientation === 'horizontal' ? 80 : 60}
                    />

                    {showTooltip && (
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                        />
                    )}

                    {showLegend && <Legend />}

                    <Bar
                        dataKey={dataKey}
                        fill={colors[0] || '#3B82F6'}
                        radius={[4, 4, 0, 0]}
                        barSize={barSize}
                    />
                </RechartsBarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export const MultiBarChart = ({
    data = [],
    series = [],
    nameKey = 'name',
    title,
    subtitle,
    height = 300,
    loading = false,
    error = null,
    colors = CHART_COLORS.palette,
    showLegend = true,
    showGrid = true,
    showTooltip = true,
    stacked = false,
    margin = { top: 20, right: 30, left: 20, bottom: 5 },
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
                <RechartsBarChart data={data} margin={margin}>
                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                        />
                    )}

                    <XAxis
                        dataKey={nameKey}
                        tick={{ fontSize: 12, fill: '#666' }}
                    />

                    <YAxis
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={formatNumber}
                    />

                    {showTooltip && (
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                        />
                    )}

                    {showLegend && <Legend />}

                    {series.map((item, index) => (
                        <Bar
                            key={item.dataKey}
                            dataKey={item.dataKey}
                            name={item.name}
                            fill={colors[index % colors.length]}
                            radius={[2, 2, 0, 0]}
                            stackId={stacked ? 'stack' : undefined}
                        />
                    ))}
                </RechartsBarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default BarChart;