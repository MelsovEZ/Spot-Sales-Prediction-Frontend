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
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { COLORS } from '../dashboard/dashboard-page';
import { motion } from 'framer-motion';

const InteractiveDailyOrdersChart = ({ dailyTotals, predictions }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      setIsDialogOpen(true);
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
      <Card className="bg-[#3a3a47] border-none">
        <CardHeader className="bg-[#444451] p-6 rounded-t-lg">
          <CardTitle className="text-gray-300">Daily Order Summary</CardTitle>
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
                    stroke="#d1d5db"
                  />
                  <YAxis stroke="#d1d5db" />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Legend
                    verticalAlign="top"
                    align="center"
                    margin={{ bottom: 60, top: 60 }}
                  />
                  <Bar name="Total Orders" dataKey="total" fill="#00F49F" />
                  <Bar name="Dining Orders" dataKey="dining" fill="#4c9cb9" />
                  <Bar
                    name="Takeaway Orders"
                    dataKey="takeaway"
                    fill="#f4ba41"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#3a3a47] border-none max-w-4xl h-[80vh] overflow-y-auto">
          {selectedDate && getSelectedDateData() && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-300">
                  Daily Order Details for {selectedDate}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Total Orders: {dailyTotals[selectedDate]?.toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Card className="max-h-[400px] bg-[#444451] border-none">
                  <CardHeader>
                    <CardTitle className="text-gray-300">
                      Total Orders by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getSelectedDateData()?.categoryData || []}
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label
                          >
                            {getSelectedDateData()?.categoryData?.map(
                              (entry, index) => (
                                <Cell
                                  key={entry.name}
                                  fill={COLORS[index % COLORS.length]}
                                  stroke="none"
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="top" align="center" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="max-h-[400px] bg-[#444451] border-none">
                  <CardHeader>
                    <CardTitle className="text-gray-300">
                      Total Orders by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
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
                            stroke="#d1d5db"
                          />
                          <YAxis tick={{ fontSize: 12 }} stroke="#d1d5db" />
                          <Tooltip cursor={{ fill: 'transparent' }} />
                          <Legend
                            wrapperStyle={{ fontSize: 12 }}
                            verticalAlign="top"
                            align="center"
                          />
                          <Bar dataKey="Dining" fill="#4c9cb9" />
                          <Bar dataKey="Takeaway" fill="#f4ba41" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-[#5a5b6a] hover:bg-[#464756] text-gray-300 border-none"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default InteractiveDailyOrdersChart;
