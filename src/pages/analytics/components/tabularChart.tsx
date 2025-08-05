import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type TabularGraphProps = {
  data: {
    caseTypeCounts: {
      caseType: string;
      clientCount: number;
    }[];
    caseTypeStatusCounts: {
      count: number;
      caseType: string;
      status: number;
    }[];
  };
};

 const status = {
  COMPLETED: 0,
  PENDING: 1,
  IN_PROGRESS: 2,
  CANCELLED: 3,
};

const TabularGraph: React.FC<TabularGraphProps> = ({ data }) => {
  const { caseTypeCounts, caseTypeStatusCounts } = data;

  const transformedData = caseTypeCounts?.map((caseType) => {
    const statusCounts = caseTypeStatusCounts.filter(
      (item) => item.caseType === caseType.caseType
    );

    return {
      label: caseType.caseType,
      clientCount: caseType.clientCount,
      PENDING: statusCounts
        .filter((item) => item.status === status.PENDING)
        .reduce((sum, item) => sum + item.count, 0),
      COMPLETED: statusCounts
        .filter((item) => item.status === status.COMPLETED)
        .reduce((sum, item) => sum + item.count, 0),
      IN_PROGRESS: statusCounts
        .filter((item) => item.status === status.IN_PROGRESS)
        .reduce((sum, item) => sum + item.count, 0),
      CANCELLED: statusCounts
        .filter((item) => item.status === status.CANCELLED)
        .reduce((sum, item) => sum + item.count, 0),
    };
  });
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={transformedData}
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="clientCount" fill="#8884d8" name="Client Count" />
          <Bar dataKey="PENDING" fill="#82ca9d" name="Pending" />
          <Bar dataKey="COMPLETED" fill="#ffc658" name="Completed" />
          <Bar dataKey="IN_PROGRESS" fill="#ff7300" name="In Progress" />
          <Bar dataKey="CANCELLED" fill="#d0ed57" name="Cancelled" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TabularGraph;
