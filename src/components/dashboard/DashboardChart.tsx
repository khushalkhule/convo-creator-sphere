
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  day: string;
  count: number;
}

interface DashboardChartProps {
  data: ChartData[];
}

export const DashboardChart: React.FC<DashboardChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`${value} conversations`, 'Count']}
          labelFormatter={(label) => `${label}`}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
