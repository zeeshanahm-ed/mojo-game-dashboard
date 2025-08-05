import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface GraphProps {
  graphData: any;
  dateRanges: any;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getCurrentYear = () => new Date().getFullYear().toString();

function transformGraphData(graphData: any, dateRanges: any) {
  const transformedData: any[] = [];
  const invoiceTypes = ['paidInvoices', 'cancelledInvoices', 'unpaidInvoices', 'sentInvoices'];
  const currentYear = getCurrentYear();

  const startYear = dateRanges?.startDate ? new Date(dateRanges.startDate).getFullYear() : parseInt(currentYear);
  const endYear = dateRanges?.endDate ? new Date(dateRanges.endDate).getFullYear() : parseInt(currentYear);

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      transformedData.push({
        year,
        month,
        name: !dateRanges?.startDate && !dateRanges?.endDate ? `${monthNames[month - 1]}` : `${monthNames[month - 1]} ${year}`,
        totalAmount: 0,
      });
    }
  }

  if (graphData && Object.keys(graphData).length > 0) {
    invoiceTypes.forEach((type) => {
      const invoiceData = graphData[type];

      Object.keys(invoiceData || {}).forEach((year) => {
        if (parseInt(year) >= startYear && parseInt(year) <= endYear) {
          const months = invoiceData[year];

          Object.keys(months || {}).forEach((month) => {
            const monthData = months[month];

            Object.keys(monthData).forEach((week) => {
              const totalAmount = monthData[week]?.totalAmount || 0;
              const entry = transformedData.find(
                (d) => d.year === parseInt(year) && d.month === parseInt(month)
              );
              if (entry) entry.totalAmount += totalAmount;
            });
          });
        }
      });
    });
  }

  return transformedData;
}

function getXAxisTicks(data: any, numberOfTicks: number, dateRanges: any) {
  if (!dateRanges?.startDate && !dateRanges?.endDate) {
    return monthNames;
  } else {
    const tickInterval = Math.ceil(data.length / numberOfTicks);
    return data.filter((_: any, i: number) => i % tickInterval === 0).map((d: { name: string }) => d.name);
  }
}

function Graph({ graphData, dateRanges }: GraphProps) {
  const data = transformGraphData(graphData, dateRanges);
  const startDate = dateRanges?.startDate ? new Date(dateRanges.startDate) : new Date();
  const endDate = dateRanges?.endDate ? new Date(dateRanges.endDate) : new Date();
  const monthDiff = (endDate.getFullYear() * 12 + endDate.getMonth()) - (startDate.getFullYear() * 12 + startDate.getMonth());
  const ticks = getXAxisTicks(data, Math.min(8, monthDiff), dateRanges);

  const totalRevenue = data.reduce((sum, item) => sum + item.totalAmount, 0);

  if (!graphData || Object.keys(graphData).length === 0) {
    return <section className="px-5 my-10 text-gray-500">Loading data...</section>;
  }

  return (
    <section className="my-10">
      <div className="bg-[#FCFCFC] rounded-xl border border-[#DADADA] p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Graph showing data</h2>
          <p className="text-sm font-medium text-gray-600">
            Total Revenue of Selected Services: <span className="text-primary font-bold">${totalRevenue}</span>
          </p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" ticks={ticks} />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: 'Revenue',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#999' },
              }}
              domain={[0, 'dataMax']}
            />
            <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
            <Line
              type="monotone"
              dataKey="totalAmount"
              strokeWidth={4}
              stroke="#7CA240"
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default Graph;
