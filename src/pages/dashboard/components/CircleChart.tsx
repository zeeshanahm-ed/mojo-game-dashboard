import React, { useEffect, useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

interface PieChartProps {
    data: {
        id: string;
        name: string | { en: string; ar: string };
        percentage: number;
        count?: number; // for backward compatibility
    }[];
    minWidth?: number | string;
    height?: number;
    title: string;
    secondTitle?: string;
    showLegend?: boolean;
    innerRadius: number | undefined;
    outerRadius: number | undefined;
    teemChart?: boolean;
    isCategory?: boolean;
    getColorByStatus?: (name: string) => string;
    direction: 'ltr' | 'rtl';
}

// Helper function to get the correct name based on direction
const getName = (name: string | { en: string; ar: string }, direction: 'ltr' | 'rtl'): string => {
    if (typeof name === 'string') {
        return name;
    }
    return direction === 'rtl' ? name.ar : name.en;
};

const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    // name,
    payload,
}: any) => {
    const RADIAN = Math.PI / 180;
    // const isLabeled = name === 'Not Assigned' || name === 'Assigned' ? name : "";
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fontWeight="500"
        >
            {`${payload.originalPercentage === 0 ? 0 : (percent * 100).toFixed(0)}%`}
        </text>
    );
};

const CircleChart: React.FC<PieChartProps> = React.memo((props) => {
    const {
        data = [],
        title,
        outerRadius,
        innerRadius,
        minWidth,
        getColorByStatus,
        direction
    } = props;

    const [activeItems, setActiveItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const initialActiveItems = data.reduce((acc, item) => {
            const itemName = getName(item.name, direction);
            return {
                ...acc,
                [itemName]: true,
            };
        }, {});
        setActiveItems(initialActiveItems);
    }, [data, direction]);

    const activeData = data?.filter((item) => {
        const itemName = getName(item.name, direction);
        return activeItems[itemName];
    });

    const hasData = activeData?.some(item => item.percentage > 0);
    const finalData = hasData ? activeData : [{
        id: 'no-data',
        name: 'No Data',
        percentage: 0,
        originalPercentage: 0
    }];

    const MIN_VALUE = 0.0009;

    const processedData = finalData?.map((item) => ({
        ...item,
        count: item.percentage === 0 ? MIN_VALUE : item.percentage,
        originalPercentage: item.percentage,
        displayName: getName(item.name, direction),
    }));


    return (
        <div
            className="relative"
            style={{
                width: '100%',
                maxWidth: minWidth,
                // margin: '0 auto',
                // padding: '2rem', // Adds space around chart to prevent clipping
                boxSizing: 'content-box', // Ensure padding adds space, not compresses
            }}
        >
            {title && (
                <div
                    className={`absolute left-1/2 top-1/2 transform translate-x-[-50%] translate-y-[-70%] text-center`}
                >
                    <span className={`block text-black text-[20px]`}>
                        {title}
                    </span>
                </div>
            )}
            <ResponsiveContainer width="100%" height={400} style={{ outline: 'none' }}>
                <PieChart>
                    <Pie
                        data={processedData}
                        cx="50%"
                        cy="50%"
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        paddingAngle={3}
                        dataKey="count"
                        label={renderCustomizedLabel}
                        labelLine={false}
                    >
                        {finalData.map((entry, index) => {
                            const displayName = getName(entry.name, direction);
                            return (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        displayName === 'No Data'
                                            ? '#d1d5db'
                                            : getColorByStatus?.(displayName)
                                    }
                                />
                            );
                        })}
                    </Pie>
                    <Tooltip wrapperClassName='bg-black' content={(props) => <CustomTooltip {...props} direction={direction} />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
});

export default CircleChart;

const CustomTooltip = ({ active, payload, direction }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload?.payload;
    const name = data?.name;
    const displayName = getName(name, direction);

    // Case 2: Fallback default formatter style
    const original = data?.originalPercentage;

    return (
        <div className="bg-white p-2 rounded shadow text-sm border">
            {`${displayName}: ${original}%`}
        </div>
    );
};
