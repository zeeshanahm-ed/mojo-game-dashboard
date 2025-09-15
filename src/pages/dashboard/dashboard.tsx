import { useEffect, useState } from 'react';
import { useHeaderProps } from 'components/core/use-header-props';
import CircleChart from './components/CircleChart';
// import useDashboardData from './core/hooks/useDashboardData';
import { DatePicker, Divider, Typography } from 'antd';
import DateIcon from 'assets/icons/date-icon.svg?react';
import RevenueChart from './components/RevenueChart ';
import useGetDashboardStatistics from './core/hooks/useGetDashboardStatistics';
import { useDirection } from 'hooks/useGetDirection';


const { Text } = Typography;
const { RangePicker } = DatePicker;


// const tabs = ['Daily', 'Weekly', 'Monthly'];
const legendItems = [
  { label: 'Target', color: 'bg-green-500' },
  { label: 'Above Target', color: 'bg-green-300' },
  { label: 'Below Target', color: 'bg-red-500' }
];

// Static data removed - now using dynamic data from API

// Color generator with consistent colors based on name hash
const getColorByStatus = (name: string) => {
  // Create a simple hash from the name for consistent color generation
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate HSL values with good contrast and brightness
  const hue = Math.abs(hash) % 360; // 0-360 degrees
  const saturation = 65 + (Math.abs(hash) % 25); // 65-90% for good saturation
  const lightness = 45 + (Math.abs(hash) % 20); // 45-65% for good contrast

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};


const Dashboard = () => {

  const { setTitle } = useHeaderProps();
  const direction = useDirection();
  const [params, setParams] = useState({

  })
  const { dashboardData } = useGetDashboardStatistics(params);
  // const [activeTab, setActiveTab] = useState('Monthly')

  useEffect(() => setTitle('Dashboard'), [setTitle]);


  const handleDateRangeChange = (date: any, setState: any) => {
    if (!date?.length) {
      setState({});
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
          {/* <div className="flex border border-gray-300 h-11 rounded overflow-hidden">
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
          </div> */}
          <RangePicker
            prefix={<DateIcon className="w-6 h-6 mr-2" />}
            suffixIcon={null}
            className='h-11 w-[320px]'
            onChange={(date) => handleDateRangeChange(date, setParams)}
            format="MM/DD/YYYY"
          />
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-6 mx-auto mt-6 max-w-full">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className={`flex items-center border-[#4E7909] justify-between border px-6 py-3 rounded`}>
            <Text className={`text-[#4E7909] text-lg`}>Active Users</Text>
            <Text className="text-[#4E7909] flex items-center text-lg ">
              <div className='h-8 w-px bg-gray-300 mx-4'></div>
              {dashboardData?.statistics?.activeUsers || 0}
            </Text>
          </div>
          <div className={`flex items-center border-[#797509] justify-between border px-6 py-3 rounded `}>
            <Text className={`text-[#797509] text-lg`}>New Registration</Text>
            <Text className="text-[#797509] flex items-center text-lg">
              <div className='h-8 w-px bg-gray-300 mx-4 '></div>
              {dashboardData?.statistics?.newRegistration || 0}
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
      <RevenueChart data={dashboardData?.revenue} />
      <Divider />

      <div className="w-full flex items-center justify-between overflow-hidden">
        {/* Most Used Categories */}
        <div className="flex-1 flex lg:flex-col 2xl:flex-row justify-center gap-x-20 items-center min-w-[300px] h-auto">
          <CircleChart
            data={dashboardData?.popularCategories || []}
            title="Usage"
            innerRadius={100}
            outerRadius={150}
            minWidth={300}
            isCategory={true}
            getColorByStatus={getColorByStatus}
            direction={direction}
          />
          <div className="flex flex-col gap-3">
            {(dashboardData?.popularCategories || []).map((item: any, index: number) => {
              const displayName = typeof item.name === 'string' ? item.name : (direction === 'rtl' ? item.name.ar : item.name.en);
              return (
                <div key={item.id || index} className="flex items-center gap-2">
                  {/* Dot */}
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getColorByStatus(displayName) }}
                  />
                  {/* Label */}
                  <span className="font-medium" style={{ color: getColorByStatus(displayName) }}>
                    {displayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-[2px] h-72 bg-border-gray"></div>
        <div className="flex-1 flex justify-center lg:flex-col 2xl:flex-row gap-x-20 items-center min-w-[300px] h-auto">
          <CircleChart
            data={dashboardData?.lifelines || []}
            title="Usage"
            innerRadius={100}
            outerRadius={150}
            minWidth={300}
            getColorByStatus={getColorByStatus}
            isCategory={false}
            direction={direction}
          />
          <div className="flex flex-col gap-3">
            {(dashboardData?.lifelines || []).map((item: any, index: number) => (
              <div key={item.id || index} className="flex items-center gap-2">
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

