import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { useTranslation } from 'react-i18next';
import { useDirection } from "hooks/useGetDirection";

interface BackendData {
    totalAmount: number;
    subscriptions: number;
    currency: string;
    byMonth: Array<{
        label: string;
        totalAmount: number;
        subscriptions: number;
        year: number;
        month: number;
    }>;
}

const RevenueChart = ({ data }: { data: BackendData }) => {
    const { t } = useTranslation();
    const direction = useDirection();

    // Function to translate month names
    const translateMonth = (monthName: string) => {
        // Map English month names to translation keys
        const monthMap: { [key: string]: string } = {
            'January': 'January',
            'February': 'February',
            'March': 'March',
            'April': 'April',
            'May': 'May',
            'June': 'June',
            'July': 'July',
            'August': 'August',
            'September': 'September',
            'October': 'October',
            'November': 'November',
            'December': 'December',
            // Short forms
            'Jan': 'January',
            'Feb': 'February',
            'Mar': 'March',
            'Apr': 'April',
            'Jun': 'June',
            'Jul': 'July',
            'Aug': 'August',
            'Sep': 'September',
            'Oct': 'October',
            'Nov': 'November',
            'Dec': 'December'
        };

        const translationKey = monthMap[monthName];
        return translationKey ? t(translationKey) : monthName;
    };

    // Transform backend data to chart format
    const chartData = data?.byMonth?.map((item) => {
        // Calculate percentages based on total amount
        const totalAmount = data.totalAmount || 1; // Avoid division by zero
        const percentage = totalAmount > 0 ? (item.totalAmount / totalAmount) * 100 : 0;

        // Show minimum 2% bar for zero values to make them visible
        const displayPercentage = item.totalAmount === 0 ? 2 : percentage;

        return {
            month: translateMonth(item.label),
            target: displayPercentage,
            aboveTarget: 0, // Not used in your data structure
            belowTarget: 0, // Not used in your data structure
            totalAmount: item.totalAmount,
            subscriptions: item.subscriptions,
            originalData: item,
            isZeroValue: item.totalAmount === 0
        };
    }) || [];

    return (
        <div className="bg-white py-6 ">
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        barCategoryGap="10%"
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                        <XAxis
                            dataKey="month"
                            axisLine={{ stroke: "#d1d5db" }}
                            tickLine={true}
                            tick={{ fontSize: 12, fill: "#374151" }}
                        />
                        <YAxis
                            axisLine={{ stroke: "#d1d5db" }}
                            tickLine={true}
                            tick={{ fontSize: 12, fill: "#374151" }}
                            tickFormatter={(value) => `${value}%`}
                            domain={[0, 100]}
                            ticks={[0, 25, 50, 75, 100]}
                        />
                        <Tooltip
                            formatter={(_value, _name, props) => {
                                const data = props.payload;
                                if (data.isZeroValue) {
                                    return [t('No Revenue'), t('Revenue')];
                                }
                                return [
                                    `${data.totalAmount} ${t('SAR')}`,
                                    t('Revenue')
                                ];
                            }}
                            contentStyle={{
                                fontSize: "12px",
                                borderRadius: "6px",
                            }}
                        />
                        <Bar dataKey="target" stackId="revenue" radius={[3, 3, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.isZeroValue ? "#e5e7eb" : "#22c55e"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
