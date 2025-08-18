import { useEffect, useState } from 'react';
import { useHeaderProps } from 'components/core/use-header-props';
import { ServicesStatusDataParams } from './core/_modals';
import CircleChart from './components/CircleChart';
// import useDashboardData from './core/hooks/useDashboardData';
import { DatePicker, Divider, Typography } from 'antd';
import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';
import RevenueChart from './components/RevenueChart ';


const { Text } = Typography;
const { RangePicker } = DatePicker;


const tabs = ['Daily', 'Weekly', 'Monthly'];
const legendItems = [
  { label: 'Target', color: 'bg-green-500' },
  { label: 'Above Target', color: 'bg-green-300' },
  { label: 'Below Target', color: 'bg-red-500' }
];

// Dummy static data
const categoriesData = [
  { name: "Football", count: 40 },
  { name: "Supported Employment", count: 30 },
  { name: "Wrestling", count: 20 },
  { name: "Job Coaching", count: 10 },
];
const lifelinesData = [
  { name: "Call a friend", count: 50 },
  { name: "2nd Chance", count: 30 },
  { name: "Steal a score", count: 20 },
];

// Optional: color resolver
const getColorByStatus = (name: string) => {
  switch (name) {
    case "Football":
      return "#22c55e"; // green
    case "Supported Employment":
      return "#f97316"; // orange
    case "Wrestling":
      return "#a855f7"; // purple
    case "Job Coaching":
      return "#dc2626"; // red
    case "Call a friend":
      return "#5b21b6"; // deep purple
    case "2nd Chance":
      return "#db2777"; // pink
    case "Steal a score":
      return "#3b82f6"; // blue
    default:
      return "#9ca3af"; // gray
  }
};


const Dashboard = () => {

  const { setTitle } = useHeaderProps();
  const [activeTab, setActiveTab] = useState('Daily')
  const [statisticsDateRanges, setStatisticsDateRanges] = useState<ServicesStatusDataParams>({
    startDate: "",
    endDate: "",
  });
  // const { DashboardData } = useDashboardData(statisticsDateRanges);

  useEffect(() => setTitle('Dashboard'), [setTitle]);


  const handleDateRangeChange = (date: any, setState: any) => {
    if (!date?.length) {
      setState({ startDate: "", endDate: "" });
    } else {
      setState((prev: any) => ({
        ...prev,
        startDate: date[0].toISOString(),
        endDate: date[1].toISOString(),
      }));
    }
  };

  return (
    <section className='my-10'>
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-medium font-poppins">User Monitoring</h1>
        <div className="flex items-center justify-end flex-wrap gap-2">
          {/* Tab buttons */}
          <div className="flex border border-gray-300 h-11 rounded overflow-hidden">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
              px-4 py-2 text-sm font-medium transition-colors duration-200
              ${activeTab === tab ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}
              ${index !== tabs.length - 1 ? 'border-r border-gray-300' : ''}`}
              >{tab}</button>
            ))}
          </div>
          <div className="flex items-center border rounded px-2 h-11 w-[300px]">
            <DatePickerIcon className="w-6 h-6 mr-2" />
            <RangePicker
              suffixIcon={null}
              variant='borderless'
              onChange={(date) => handleDateRangeChange(date, setStatisticsDateRanges)}
              format="MM/DD/YYYY"
            />
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-6 mx-auto mt-6 max-w-full">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className={`flex items-center border-[#4E7909] justify-between border px-6 py-3 rounded`}>
            <Text className={`text-[#4E7909] text-lg`}>Active Users</Text>
            <Text className="text-gray-900 flex items-center text-lg">
              <div className={`h-8 w-px bg-gray-300 mx-4 text-[#4E7909]`}></div>
              45
            </Text>
          </div>
          <div className={`flex items-center border-[#797509] justify-between border px-6 py-3 rounded`}>
            <Text className={`text-[#797509] text-lg`}>New Registration</Text>
            <Text className="text-gray-900 flex items-center text-lg">
              <div className={`h-8 w-px bg-gray-300 mx-4 text-[#797509]`}></div>
              02
            </Text>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-6 bg-white w-1/2">
        {/* Title */}
        <h1 className="text-xl font-medium font-poppins">
          Revenue Generation
        </h1>

        {/* Legend */}
        <div className="flex items-center gap-6">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-sm text-gray-700 font-medium font-inter">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Divider />
      <RevenueChart />
      <Divider />

      <div className="w-full flex items-center justify-between overflow-hidden">
        {/* Most Used Categories */}
        <div className="flex-1 flex lg:flex-col 2xl:flex-row justify-center gap-x-20 items-center min-w-[300px] h-auto">
          <CircleChart
            data={categoriesData}
            title="Usage"
            innerRadius={100}
            outerRadius={150}
            minWidth={300}
            getColorByStatus={getColorByStatus}
          />
          <div className="flex flex-col gap-3">
            {categoriesData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {/* Dot */}
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getColorByStatus(item.name) }}
                />
                {/* Label */}
                <span className="font-medium" style={{ color: getColorByStatus(item.name) }}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>

        </div>
        <div className="w-[2px] h-72 bg-border-gray"></div>
        <div className="flex-1 flex justify-center lg:flex-col 2xl:flex-row gap-x-20 items-center min-w-[300px] h-auto">
          <CircleChart
            data={lifelinesData}
            title="Usage"
            innerRadius={100}
            outerRadius={150}
            minWidth={300}
            getColorByStatus={getColorByStatus}
          />
          <div className="flex flex-col gap-3">
            {lifelinesData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {/* Dot */}
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getColorByStatus(item.name) }}
                />
                {/* Label */}
                <span className="font-medium" style={{ color: getColorByStatus(item.name) }}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Dashboard;

