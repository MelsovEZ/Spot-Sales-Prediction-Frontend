"use client";
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select";
import { PredictionResponse } from '@/types/dashboard-interfaces';
import DailyOrderDrawer from '@/components/daily-drawer';
import LogoutButton from './logout-button';
import LoadingDashboard from './loading-dashboard';
import ErrorDashboard from './error-dashboard';

const AREAS = ['Arcadia Bay', 'Cyber City', 'Elysium District', 'Mystic Falls', 'Neo Tokyo'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const TIME_RANGES = [
    { value: '1d', label: '1 Day' },
    { value: '1w', label: '1 Week' },
    { value: '2w', label: '2 Weeks' },
    { value: '1m', label: '1 Month' }
];

const PredictionDashboard = () => {
    const [areaData, setAreaData] = useState<Record<string, PredictionResponse>>({});
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
                    AREAS.map(area =>
                        fetch('http://localhost:8000/predict', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                area: area,
                                target_date: new Date().toISOString().split('T')[0],
                                range: selectedRange
                            })
                        }).then(res => res.json())
                    )
                );

                const newAreaData: Record<string, PredictionResponse> = {};
                predictions.forEach((prediction, index) => {
                    newAreaData[AREAS[index]] = prediction;
                });
                setAreaData(newAreaData);
            } catch (error: unknown) {
                setError(`Failed to fetch predictions: ${error instanceof Error ? error.message : String(error)}`);
            } finally {
                setLoading(false);
            }
        };

        fetchAllPredictions();
    }, [selectedRange]);

    if (loading) return <LoadingDashboard />;
    if (error) return <ErrorDashboard error />
    if (Object.keys(areaData).length === 0) return null;

    const selectedPredictions = areaData[selectedArea];

    const categoryTotals = selectedPredictions.predictions.reduce<Record<string, number>>((acc, curr) => {
        if (!acc[curr.Category]) acc[curr.Category] = 0;
        acc[curr.Category] += curr.Predicted_Orders;
        return acc;
    }, {});

    const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value
    }));

    const orderTypeData = selectedPredictions.predictions.reduce<Record<string, { name: string; Dining: number; Takeaway: number }>>((acc, curr) => {
        const key = `${curr.Item} (${curr.Category})`;
        if (!acc[key]) {
            acc[key] = {
                name: key,
                Dining: 0,
                Takeaway: 0
            };
        }
        acc[key][curr.Type_of_Order] += curr.Predicted_Orders;
        return acc;
    }, {});

    const totalOrders = Object.values(areaData).reduce((sum, area) => sum + area.total_orders, 0);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <Card className="bg-white shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-800">I&apos;M&apos;s Prediction Dashboard</h1>
                            <div className="flex items-center gap-6">
                                <Select value={selectedRange} onValueChange={setSelectedRange}>
                                    <SelectTrigger className="w-36">
                                        <SelectValue placeholder="Select Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIME_RANGES.map(range => (
                                            <SelectItem key={range.value} value={range.value}>
                                                {range.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="text-lg">
                                    Total Orders: <span className="font-bold text-gray-900">{totalOrders.toLocaleString()}</span>
                                </div>
                                <LogoutButton />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Date Range Card */}
                <Card className="bg-white shadow-lg">
                    <CardHeader className="border-b bg-gray-50 p-6">
                        <CardTitle className="text-xl text-gray-800">Date Range Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-gray-700">
                            Showing data from{' '}
                            <span className="font-medium">{selectedPredictions.date_range.start_date}</span>
                            {' '}to{' '}
                            <span className="font-medium">{selectedPredictions.date_range.end_date}</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Area Tabs */}
                <Tabs defaultValue={selectedArea} onValueChange={setSelectedArea} className="space-y-6">
                    <TabsList className="grid grid-cols-5 w-full h-16 bg-white shadow-md rounded-lg p-1">
                        {AREAS.map(area => (
                            <TabsTrigger
                                key={area}
                                value={area}
                                className="py-3 px-4 text-sm font-medium data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
                            >
                                {area}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {AREAS.map(area => (
                        <TabsContent key={area} value={area} className="space-y-6 mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category Chart */}
                                <Card className="bg-white shadow-lg">
                                    <CardHeader className="border-b bg-gray-50 p-6">
                                        <CardTitle className="text-xl text-gray-800">Total Orders by Category - {area}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={categoryData}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={100}
                                                        label
                                                    >
                                                        {categoryData.map((entry, index) => (
                                                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend verticalAlign="bottom" height={36} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Order Type Chart */}
                                <Card className="bg-white shadow-lg">
                                    <CardHeader className="border-b bg-gray-50 p-6">
                                        <CardTitle className="text-xl text-gray-800">Dining vs Takeaway Orders - {area}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={Object.values(orderTypeData)}
                                                    margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend verticalAlign="top" height={36} />
                                                    <Bar dataKey="Dining" fill="#FFB5B5" />
                                                    <Bar dataKey="Takeaway" fill="#B5D8FF" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Daily Summary */}
                            <Card className="bg-white shadow-lg">
                                <CardHeader className="border-b bg-gray-50 p-6">
                                    <CardTitle className="text-xl text-gray-800">Daily Order Summary - {area}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {Object.entries(areaData[area].daily_totals).map(([date, total]) => (
                                            <DailyOrderDrawer
                                                key={date}
                                                date={date}
                                                total={total}
                                                predictions={areaData[area].predictions.filter(p => p.Date === date)}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}

export default PredictionDashboard;