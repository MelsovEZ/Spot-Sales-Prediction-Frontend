import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import fadeIn from '../dashboard/dashboard-page';

function OrderTypeChart({ data }) {
  return (
    <motion.div {...fadeIn} transition={{ duration: 0.3, delay: 0.1 }}>
      <Card className="bg-[#464756] ">
        <CardHeader className="border-b bg-[#464756] p-6">
          <CardTitle className="text-xl text-gray-800">
            Dining vs Takeaway Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-96 overflow-x-auto">
            <div className="min-w-[500px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.values(data)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="Dining" fill="#8884d8" />
                  <Bar dataKey="Takeaway" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default OrderTypeChart;
