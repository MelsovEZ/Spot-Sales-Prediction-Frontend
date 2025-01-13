import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { motion } from 'framer-motion';

interface Prediction {
  Category: string;
  Item: string;
  Type_of_Order: 'Dining' | 'Takeaway';
  Predicted_Orders: number;
  Date: string;
}

interface DashboardData {
  predictions: Prediction[];
  daily_totals: Record<string, number>;
}

interface ItemTotal {
  name: string;
  total: number;
  category: string;
}

interface RevenueData {
  name: string;
  revenue: number;
  volume: number;
}

const AVERAGE_PRICES: Record<string, number> = {
  Burgers: 15,
  Desserts: 8,
  Drinks: 5,
  Sides: 6,
  Specials: 18,
};

const AdditionalCharts = ({ data }: { data: DashboardData }) => {
  // Process data for item popularity
  const itemTotals = data.predictions.reduce<Record<string, ItemTotal>>(
    (acc, curr) => {
      const key = curr.Item;
      if (!acc[key]) {
        acc[key] = {
          name: key,
          total: 0,
          category: curr.Category,
        };
      }
      acc[key].total += curr.Predicted_Orders;
      return acc;
    },
    {}
  );

  const itemPopularityData = Object.values(itemTotals).sort(
    (a, b) => b.total - a.total
  );

  // Process data for revenue analysis
  const revenueData: RevenueData[] = Object.values(itemTotals).map((item) => ({
    name: item.name,
    revenue: item.total * (AVERAGE_PRICES[item.category] || 0),
    volume: item.total,
  }));

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-[#3a3a47] border-none">
        <CardHeader className="bg-[#444451] p-6 rounded-t-lg">
          <CardTitle className="text-xl text-gray-300">
            Top Items by Order Volume
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-96 overflow-x-auto">
            <div className="min-w-[500px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={itemPopularityData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" stroke="#d1d5db" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={90}
                    tick={{ fontSize: 12 }}
                    stroke="#d1d5db"
                  />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Legend verticalAlign="top" align="center" />
                  <Bar dataKey="total" name="Total Orders" fill="#4c9cb9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#3a3a47] border-none">
        <CardHeader className="bg-[#444451] p-6 rounded-t-lg">
          <CardTitle className="text-xl text-gray-300">
            Revenue vs Volume Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-96 overflow-x-auto">
            <div className="min-w-[500px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{ fontSize: 12 }}
                    stroke="#d1d5db"
                  />
                  <YAxis yAxisId="left" stroke="#d1d5db" />
                  <YAxis yAxisId="right" orientation="right" stroke="#d1d5db" />
                  <Tooltip />
                  <Legend verticalAlign="top" align="center" />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    name="Est. Revenue ($)"
                    stroke="#4c9cb9"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="volume"
                    name="Order Volume"
                    stroke="#00F49F"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdditionalCharts;
