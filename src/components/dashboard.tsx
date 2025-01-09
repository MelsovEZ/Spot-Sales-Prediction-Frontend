'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/card';
import { Tabs, TabsContent } from '@/components/tabs';
import { PredictionResponse } from '@/types/dashboard-interfaces';
import LogoutButton from './logout-button';
import LoadingDashboard from './loading-dashboard';
import ErrorDashboard from './error-dashboard';
import InteractiveDailyOrdersChart from './daily-charts';
import AreaNavigation from './area-navigation';
import ChartsSection from './charts-section';
import DashboardHeader from './dashboard-header';
import DateRangeInfo from './date-range-info';
import DashboardLayout from './dashboard-layout';

export const AREAS = [
  'Arcadia Bay',
  'Cyber City',
  'Elysium District',
  'Mystic Falls',
  'Neo Tokyo',
];
export const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
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

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const PredictionDashboard = () => {
  const [areaData, setAreaData] = useState<Record<string, PredictionResponse>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState(AREAS[0]);
  const [selectedRange, setSelectedRange] = useState('1d');

  useEffect(() => {
    const fetchAllPredictions = async () => {
      setLoading(true);
      setError(null);
      try {
        const predictions = await Promise.all(
          AREAS.map((area) =>
            fetch(
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
            ).then((res) => res.json())
          )
        );

        const newAreaData: Record<string, PredictionResponse> = {};
        predictions.forEach((prediction, index) => {
          newAreaData[AREAS[index]] = prediction;
        });
        setAreaData(newAreaData);
      } catch (error: unknown) {
        setError(
          `Failed to fetch predictions: ${error instanceof Error ? error.message : String(error)}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllPredictions();
  }, [selectedRange]);

  if (loading) return <LoadingDashboard />;
  if (error) return <ErrorDashboard error />;
  if (Object.keys(areaData).length === 0) return null;

  const selectedPredictions = areaData[selectedArea];

  const categoryTotals = selectedPredictions.predictions.reduce<
    Record<string, number>
  >((acc, curr) => {
    if (!acc[curr.Category]) acc[curr.Category] = 0;
    acc[curr.Category] += curr.Predicted_Orders;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const orderTypeData = selectedPredictions.predictions.reduce<
    Record<string, { name: string; Dining: number; Takeaway: number }>
  >((acc, curr) => {
    const key = `${curr.Item} (${curr.Category})`;
    if (!acc[key]) {
      acc[key] = {
        name: key,
        Dining: 0,
        Takeaway: 0,
      };
    }
    acc[key][curr.Type_of_Order] += curr.Predicted_Orders;
    return acc;
  }, {});

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
      />
      <DateRangeInfo
        startDate={selectedPredictions.date_range.start_date}
        endDate={selectedPredictions.date_range.end_date}
      />
      <Tabs
        defaultValue={selectedArea}
        onValueChange={setSelectedArea}
        className="space-y-6"
      >
        <AreaNavigation />
        {AREAS.map((area) => (
          <TabsContent key={area} value={area} className="space-y-6 mt-6">
            <ChartsSection
              categoryData={categoryData}
              orderTypeData={orderTypeData}
            />
            <InteractiveDailyOrdersChart
              dailyTotals={areaData[area].daily_totals}
              predictions={areaData[area].predictions}
            />
          </TabsContent>
        ))}
      </Tabs>
      <div className="mt-8">
        <Card className="bg-gray-100 shadow-none border-none">
          <CardContent className="flex justify-end p-0 md:pd-12">
            <LogoutButton />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PredictionDashboard;
