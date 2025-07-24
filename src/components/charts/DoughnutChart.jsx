import React from 'react';
import { DoughnutChart as BaseDoughnutChart } from './PieChart';


const DoughnutChart = ({
    innerRadius = 60,
    outerRadius = 120,
    ...props
}) => {
    return (
        <BaseDoughnutChart
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            {...props}
        />
    );
};

export default DoughnutChart;