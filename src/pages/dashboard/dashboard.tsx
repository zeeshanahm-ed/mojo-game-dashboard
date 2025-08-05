import { useEffect, useState } from 'react';
import { useHeaderProps } from 'components/core/use-header-props';
import { ServicesStatusDataParams } from './core/_modals';
// import useDashboardData from './core/hooks/useDashboardData';
import { DatePicker, Typography } from 'antd';
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

// Static data for Most Used Categories
const categoriesData: ProgressItem[] = [
  { label: 'Football', percentage: 80, color: '#10b981' },
  { label: 'Wrestling', percentage: 60, color: '#8b5cf6' },
  { label: 'Mathematics', percentage: 50, color: '#f59e0b' },
  { label: 'Football', percentage: 30, color: '#dc2626' },
  { label: 'Others', percentage: 10, color: '#10b981' },
];

// Static data for Most Used Lifelines
const lifelinesData: ProgressItem[] = [
  { label: 'Call a Friend', percentage: 80, color: '#374151' },
  { label: '2nd Chance', percentage: 60, color: '#374151' },
  { label: 'Score Steal', percentage: 50, color: '#9ca3af' },
];


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
    <section>
      <div className="flex items-center justify-between">
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

      <RevenueChart />

      <div className="w-full flex items-start justify-between overflow-hidden">
        {/* Most Used Categories */}
        <HorizontalProgress
          title="Most Used Categories"
          data={categoriesData}
        />
        <div className="w-[2px] h-72 bg-border-gray"></div>

        {/* Most Used Lifelines */}
        <HorizontalProgress
          title="Most Used Lifelines"
          data={lifelinesData}
        />
      </div>

    </section>
  );
};

export default Dashboard;



import React from 'react';

interface ProgressItem {
  label: string;
  percentage: number;
  color: string;
}

interface HorizontalProgressProps {
  title: string;
  data: ProgressItem[];
}

const HorizontalProgress: React.FC<HorizontalProgressProps> = ({ title, data }) => {
  return (
    <div className="w-[45%]">
      <h2 className="text-lg font-medium text-gray-900 mb-6 font-poppins">{title}</h2>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Label */}
            <div className="w-32 text-lg font-medium">
              {item.label}
            </div>

            {/* Progress Bar Container */}
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300 ease-in-out"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>

              {/* Percentage */}
              <div className="w-10 text-sm text-gray-700 font-medium text-right">
                {item.percentage}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
