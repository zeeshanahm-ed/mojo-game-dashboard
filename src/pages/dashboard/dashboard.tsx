import { useEffect, useState } from 'react';
import { useHeaderProps } from 'components/core/use-header-props';
import CircleChart from './components/CircleChart';
import { DatePicker, Divider } from 'antd';
import DateIcon from 'assets/icons/date-icon.svg?react';
import RevenueChart from './components/RevenueChart ';
import useGetDashboardStatistics from './core/hooks/useGetDashboardStatistics';
import { useDirection } from 'hooks/useGetDirection';
import { useTranslation } from 'react-i18next';


const { RangePicker } = DatePicker;

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
  const { t } = useTranslation();
  const direction = useDirection();
  const [params, setParams] = useState({

  })
  const { dashboardData } = useGetDashboardStatistics(params);
  // const [activeTab, setActiveTab] = useState('Monthly')

  useEffect(() => setTitle(t("Dashboard")), [setTitle]);


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
        <h1 className="text-2xl font-medium">{t("Statistics")}</h1>
        <div className="flex items-center justify-end flex-wrap gap-2">
          <span className='text-lg font-normal'>{t("Date filter")}</span>
          <RangePicker
            prefix={<DateIcon className="w-6 h-6 mr-2" />}
            suffixIcon={null}
            className='h-11 w-[320px]'
            onChange={(date) => handleDateRangeChange(date, setParams)}
            format="MM/DD/YYYY"
            placeholder={[t("Start date"), t("End date")]}
          />
        </div>
      </div>

      <div className="py-6 mx-auto mt-6 max-w-full">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className={`flex items-center border-[#4E7909] justify-between border px-6 py-3 rounded`}>
            <p className={`text-[#4E7909] text-lg`}>{t("Active Users")}</p>
            <div className="text-[#4E7909] flex items-center text-lg ">
              <div className='h-8 w-px bg-gray-300 mx-4'></div>
              {dashboardData?.statistics?.activeUsers || 0}
            </div>
          </div>
          <div className={`flex items-center border-[#797509] justify-between border px-6 py-3 rounded `}>
            <p className={`text-[#797509] text-lg`}>{t("New Registration")}</p>
            <div className="text-[#797509] flex items-center text-lg">
              <div className='h-8 w-px bg-gray-300 mx-4 '></div>
              {dashboardData?.statistics?.newRegistration || 0}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-6 bg-white w-1/2">
        {/* Title */}
        <h1 className="text-xl font-medium">
          {t("Revenue Generation")}
        </h1>
      </div>

      <Divider />
      <RevenueChart data={dashboardData?.revenue} />
      <Divider />

      <div className="w-full flex items-center justify-between overflow-hidden">
        {/* Most Used Categories */}
        <div className='w-full'>
          <p className='text-lg w-full text-center font-normal'>{t("Usage of popular categories")} </p>
          <div className="flex-1 flex lg:flex-col 2xl:flex-row justify-center gap-x-20 items-center min-w-[300px] h-auto">
            <CircleChart
              data={dashboardData?.popularCategories || []}
              title={t("Categories")}
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
        </div>
        <div className="w-[2px] h-72 bg-border-gray"></div>
        <div className='w-full'>
          <p className='text-lg w-full text-center font-normal'>{t("Usage of lifelines")} </p>
          <div className="flex-1 flex justify-center lg:flex-col 2xl:flex-row gap-x-20 items-center min-w-[300px] h-auto">
            <CircleChart
              data={dashboardData?.lifelines || []}
              title={t("Lifelines")}
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
      </div>

    </section>
  );
};

export default Dashboard;

