import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface ChartData {
    month: string;
    target: number;
    aboveTarget: number;
    belowTarget: number;
}

const data: ChartData[] = [
    { month: "Jan", target: 25, aboveTarget: 15, belowTarget: 0 },
    { month: "Feb", target: 45, aboveTarget: 25, belowTarget: 0 },
    { month: "Mar", target: 20, aboveTarget: 15, belowTarget: 0 },
    { month: "Apr", target: 30, aboveTarget: 35, belowTarget: 0 },
    { month: "May", target: 55, aboveTarget: 25, belowTarget: 0 },
    { month: "Jun", target: 65, aboveTarget: 20, belowTarget: 0 },
    { month: "Jul", target: 25, aboveTarget: 20, belowTarget: 0 },
    { month: "Aug", target: 15, aboveTarget: 15, belowTarget: 25 },
    { month: "Sep", target: 30, aboveTarget: 20, belowTarget: 0 },
    { month: "Oct", target: 0, aboveTarget: 0, belowTarget: 0 },
    { month: "Nov", target: 20, aboveTarget: 15, belowTarget: 0 },
    { month: "Dec", target: 30, aboveTarget: 35, belowTarget: 0 },
];

const RevenueChart = () => {
    return (
        <div className="bg-white py-6 ">
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        barCategoryGap="10%"
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >

                        <XAxis
                            dataKey="month"
                            axisLine={{ stroke: "#d1d5db", }} // Light gray line under months
                            tickLine={true}
                            tick={{ fontSize: 12, fill: "#374151", }}
                        />
                        <YAxis
                            axisLine={{ stroke: "#d1d5db" }} // Light gray Y axis
                            tickLine={true}
                            tick={{ fontSize: 12, fill: "#374151" }}
                            tickFormatter={(value) => `${value}%`}
                            domain={[0, 100]}
                            ticks={[0, 25, 50, 75, 100]}
                        />
                        <Tooltip
                            formatter={(value) => `${value}%`}
                            contentStyle={{
                                fontSize: "12px",
                                borderRadius: "6px",
                            }}
                        />
                        <Bar
                            dataKey="target"
                            stackId="revenue"
                            fill="#22c55e"
                            radius={[0, 0, 0, 0]}
                        />
                        <Bar
                            dataKey="aboveTarget"
                            stackId="revenue"
                            fill="#86efac"
                            radius={[3, 3, 0, 0]}
                        />
                        <Bar dataKey="belowTarget" stackId="revenue" radius={[3, 3, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.belowTarget > 0 ? "#ef4444" : "transparent"}
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
