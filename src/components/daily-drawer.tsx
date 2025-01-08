"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card';
import { Button } from "@/components/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/drawer";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function DailyOrderDrawer({ date, total, predictions }) {
    const categoryTotals = predictions.reduce((acc, curr) => {
        if (!acc[curr.Category]) acc[curr.Category] = 0;
        acc[curr.Category] += curr.Predicted_Orders;
        return acc;
    }, {});

    const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value
    }));

    const orderTypeData = predictions.reduce((acc, curr) => {
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

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline" className="w-full h-full p-4 bg-gray-100 rounded-sm hover:bg-gray-200">
                    <div>
                        <p className="font-semibold">{date}</p>
                        <p className="text-2xl">{total.toLocaleString()} orders</p>
                    </div>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
                    <DrawerHeader>
                        <DrawerTitle>Daily Order Details - {date}</DrawerTitle>
                        <DrawerDescription>
                            Total Orders: {total.toLocaleString()}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Total Orders by Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 overflow-x-auto">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                                ))}
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
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={Object.values(orderTypeData)}
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
                            </CardContent>
                        </Card>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline" className="mb-6">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

export default DailyOrderDrawer;
