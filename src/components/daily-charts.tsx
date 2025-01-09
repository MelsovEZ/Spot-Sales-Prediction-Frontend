import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card';
import { Button } from '@/components/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/drawer';
import { motion } from 'framer-motion';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

const InteractiveDailyOrdersChart = ({ dailyTotals, predictions }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const chartData = Object.entries(dailyTotals).map(([date, total]) => {
    const dayPredictions = predictions.filter((p) => p.Date === date);
    const dining = dayPredictions
      .filter((p) => p.Type_of_Order === 'Dining')
      .reduce((sum, p) => sum + p.Predicted_Orders, 0);
    const takeaway = dayPredictions
      .filter((p) => p.Type_of_Order === 'Takeaway')
      .reduce((sum, p) => sum + p.Predicted_Orders, 0);

    return {
      date,
      total,
      dining,
      takeaway,
      predictions: dayPredictions,
    };
  });

  const handleBarClick = (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      setSelectedDate(data.activePayload[0].payload.date);
      const drawerTrigger = document.getElementById('drawer-trigger');
      if (drawerTrigger) drawerTrigger.click();
    }
  };

  const getSelectedDateData = () => {
    if (!selectedDate) return null;
    const dateData = chartData.find((d) => d.date === selectedDate);
    if (!dateData) return null;
    const categoryTotals = dateData.predictions.reduce((acc, curr) => {
      if (!acc[curr.Category]) acc[curr.Category] = 0;
      acc[curr.Category] += curr.Predicted_Orders;
      return acc;
    }, {});
    const categoryData = Object.entries(categoryTotals).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
    const orderTypeData = dateData.predictions.reduce((acc, curr) => {
      const key = `${curr.Item} (${curr.Category})`;
      if (!acc[key]) acc[key] = { name: key, Dining: 0, Takeaway: 0 };
      acc[key][curr.Type_of_Order] += curr.Predicted_Orders;
      return acc;
    }, {});
    return { categoryData, orderTypeData: Object.values(orderTypeData) };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Drawer>
        <Card className="bg-white shadow-lg">
          <CardHeader className="border-b bg-gray-50 p-6">
            <CardTitle className="text-xl text-gray-800">
              Daily Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-96 overflow-x-auto">
              <div className="min-w-[300px] h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                    onClick={handleBarClick}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" height={40} />
                    <Bar
                      name="Total Orders"
                      dataKey="total"
                      fill="#8884d8"
                      className="cursor-pointer hover:opacity-80"
                    />
                    <Bar
                      name="Dining Orders"
                      dataKey="dining"
                      fill="#FFB5B5"
                      className="cursor-pointer hover:opacity-80"
                    />
                    <Bar
                      name="Takeaway Orders"
                      dataKey="takeaway"
                      fill="#B5D8FF"
                      className="cursor-pointer hover:opacity-80"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <DrawerTrigger id="drawer-trigger" className="hidden" />
        <DrawerContent>
          {selectedDate && getSelectedDateData() && (
            <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
              <DrawerHeader>
                <DrawerTitle>
                  Daily Order Details for {selectedDate}
                </DrawerTitle>
                <DrawerDescription>
                  Total Orders: {dailyTotals[selectedDate]?.toLocaleString()}
                </DrawerDescription>
              </DrawerHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Card className="max-h-[400px]">
                  <CardHeader>
                    <CardTitle>Total Orders by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getSelectedDateData()?.categoryData || []}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {getSelectedDateData()?.categoryData?.map(
                              (entry, index) => (
                                <Cell
                                  key={entry.name}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dining vs Takeaway Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 overflow-x-auto">
                      <div className="min-w-[400px] h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={getSelectedDateData()?.orderTypeData}
                            margin={{ top: 5, right: 10, left: 0, bottom: 60 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              tick={{ fontSize: 12 }}
                              interval={0}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Bar dataKey="Dining" fill="#0088FE" />
                            <Bar dataKey="Takeaway" fill="#00C49F" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline" className="mb-6">
                    Close
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </motion.div>
  );
};

export default InteractiveDailyOrdersChart;
