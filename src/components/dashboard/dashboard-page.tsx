'use client';
import { useState, useEffect } from 'react';
import { PredictionResponse } from '@/types/dashboard-interfaces';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Tabs, TabsContent } from '../ui/tabs';
import { redirect } from 'next/navigation';
import { ShoppingBag, Utensils, Clock, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { getAreas } from '@/lib/utils';
import LogoutButton from './logout-button';
import LoadingDashboard from './loading-dashboard';
import ErrorDashboard from './error-dashboard';
import DashboardHeader from './dashboard-header';
import DashboardLayout from './dashboard-layout';
import AdditionalCharts from '../charts/additional-charts';
import InteractiveDailyOrdersChart from '../charts/daily-charts';

export const COLORS = [
  '#0088FE',
  '#00C49F',
  '#9B3193',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

export const TIME_RANGES = [
  { value: '1d', label: '1 Day' },
  { value: '1w', label: '1 Week' },
  { value: '2w', label: '2 Weeks' },
  { value: '1m', label: '1 Month' },
];

const StatCard = ({ title, value, icon: Icon, description }) => (
  <Card className="bg-[#3a3a47] border-none">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300">{title}</p>
          <h3 className="text-2xl text-gray-300 font-bold mt-1">{value}</h3>
          <p className="text-sm text-gray-300 mt-2">{description}</p>
        </div>
        <div className="p-4 bg-[#5a5b6a] rounded-full">
          <Icon className="w-6 h-6 text-gray-300" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const PredictionDashboard = () => {
  const [areas, setAreas] = useState<string[]>([]);
  const [areaData, setAreaData] = useState<Record<string, PredictionResponse>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedRange, setSelectedRange] = useState('1d');

  useEffect(() => {
    const initializeAreas = async () => {
      try {
        const fetchedAreas = await getAreas();
        setAreas(fetchedAreas);
        if (fetchedAreas.length > 0) {
          setSelectedArea(fetchedAreas[0]);
        }
      } catch (error: unknown) {
        setError(
          error instanceof Error ? error.message : 'Failed to fetch areas'
        );
      }
    };

    initializeAreas();
  }, []);

  useEffect(() => {
    const fetchAllPredictions = async () => {
      if (!areas.length) return;

      setLoading(true);
      setError(null);

      try {
        const predictions = await Promise.all(
          areas.map(async (area) => {
            const response = await fetch(
              process.env.NODE_ENV === 'development'
                ? 'http://localhost:8000/predict'
                : 'https://spot-sales-prediction-1.onrender.com/predict',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  area: area,
                  target_date: new Date().toISOString().split('T')[0],
                  range: selectedRange,
                }),
              }
            );

            if (response.status === 404) {
              throw new Error('404');
            } else if (!response.ok) {
              throw new Error(
                `Error ${response.status}: ${response.statusText} while fetching data for ${area}`
              );
            }

            return response.json();
          })
        );

        const newAreaData: Record<string, PredictionResponse> = {};
        predictions.forEach((prediction, index) => {
          newAreaData[areas[index]] = prediction;
        });

        setAreaData(newAreaData);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchAllPredictions();
  }, [areas, selectedRange]);

  const processOrderTypes = (predictions) => {
    const dining = predictions
      .filter((p) => p.Type_of_Order === 'Dining')
      .reduce((sum, p) => sum + p.Predicted_Orders, 0);
    const takeaway = predictions
      .filter((p) => p.Type_of_Order === 'Takeaway')
      .reduce((sum, p) => sum + p.Predicted_Orders, 0);
    return [
      { name: 'Dining', value: dining },
      { name: 'Takeaway', value: takeaway },
    ];
  };

  const processItemData = (predictions) => {
    const items = predictions.reduce((acc, curr) => {
      if (!acc[curr.Item]) {
        acc[curr.Item] = {
          name: curr.Item,
          total: 0,
          dining: 0,
          takeaway: 0,
          category: curr.Category,
        };
      }
      acc[curr.Item].total += curr.Predicted_Orders;
      if (curr.Type_of_Order === 'Dining') {
        acc[curr.Item].dining += curr.Predicted_Orders;
      } else {
        acc[curr.Item].takeaway += curr.Predicted_Orders;
      }
      return acc;
    }, {});

    return Object.values(
      items as Record<
        string,
        {
          name: string;
          total: number;
          dining: number;
          takeaway: number;
          category: string;
        }
      >
    ).sort((a, b) => b.total - a.total);
  };

  if (loading) return <LoadingDashboard />;
  if (error === '404') redirect('/upload');
  if (error) return <ErrorDashboard error={String(error)} />;
  if (Object.keys(areaData).length === 0 || !selectedArea) return null;

  const selectedPredictions = areaData[selectedArea];
  const orderTypes = processOrderTypes(selectedPredictions.predictions);
  const itemData = processItemData(selectedPredictions.predictions);

  const categoryTotals = selectedPredictions.predictions.reduce((acc, curr) => {
    if (!acc[curr.Category]) acc[curr.Category] = 0;
    acc[curr.Category] += curr.Predicted_Orders;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const totalOrders = Object.values(areaData).reduce(
    (sum, area) => sum + area.total_orders,
    0
  );

  return (
    <DashboardLayout>
      <DashboardHeader
        totalOrders={totalOrders}
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
        startDate={selectedPredictions.date_range.start_date}
        endDate={selectedPredictions.date_range.end_date}
        selectedArea={selectedArea}
        onAreaChange={setSelectedArea}
      />

      <Tabs
        defaultValue={selectedArea}
        onValueChange={setSelectedArea}
        className="space-y-6"
      >
        {areas.map((area) => (
          <TabsContent key={area} value={area} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Predicted Orders"
                value={areaData[area].total_orders.toLocaleString()}
                icon={ShoppingBag}
                description="Expected orders for today"
              />
              <StatCard
                title="Dining Orders"
                value={orderTypes[0].value.toLocaleString()}
                icon={Utensils}
                description="Expected dine-in customers"
              />
              <StatCard
                title="Takeaway Orders"
                value={orderTypes[1].value.toLocaleString()}
                icon={Clock}
                description="Expected takeaway orders"
              />
              <StatCard
                title="Categories"
                value={categoryData.length}
                icon={TrendingUp}
                description="Active menu categories"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#3a3a47] border-none">
                <CardHeader className="bg-[#444451] p-6 rounded-t-lg">
                  <CardTitle className="text-gray-300">
                    Distribution of Top Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={itemData.slice(0, 5)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={150}
                          stroke="#d1d5db"
                        />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Legend
                          verticalAlign="top"
                          align="center"
                          margin={{ bottom: 60, top: 60 }}
                        />
                        <Bar
                          dataKey="dining"
                          name="Dining"
                          stackId="a"
                          fill="#4c9cb9"
                          className="hover:bg-none"
                        />
                        <Bar
                          dataKey="takeaway"
                          name="Takeaway"
                          stackId="a"
                          fill="#f4ba41"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#3a3a47] border-none">
                <CardHeader className="bg-[#444451] p-6 rounded-t-lg">
                  <CardTitle className="text-gray-300">
                    Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label
                        >
                          {categoryData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              stroke="none"
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                          verticalAlign="top"
                          align="center"
                          margin={{ bottom: 60, top: 60 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#3a3a47] border-none">
              <CardHeader className="bg-[#444451] p-6 rounded-t-lg">
                <CardTitle className="text-gray-300">
                  Dining vs Takeaway by Item
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={itemData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        stroke="#d1d5db"
                      />
                      <YAxis stroke="#d1d5db" />
                      <Tooltip cursor={{ fill: 'transparent' }} />
                      <Legend
                        verticalAlign="top"
                        align="center"
                        margin={{ bottom: 60, top: 60 }}
                      />
                      <Bar dataKey="dining" name="Dining" fill="#4c9cb9" />
                      <Bar dataKey="takeaway" name="Takeaway" fill="#f4ba41" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <AdditionalCharts data={areaData[area]} />

            <InteractiveDailyOrdersChart
              dailyTotals={areaData[area].daily_totals}
              predictions={areaData[area].predictions}
            />
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8">
        <Card className="bg-[#252533] shadow-none border-none">
          <CardContent className="flex justify-end p-0 md:pd-12">
            <LogoutButton />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PredictionDashboard;
