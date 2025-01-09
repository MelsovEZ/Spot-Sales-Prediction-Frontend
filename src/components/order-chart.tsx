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
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { fadeIn } from './dashboard';

function OrderTypeChart({ data }) {
  return (
    <motion.div {...fadeIn} transition={{ duration: 0.3, delay: 0.1 }}>
      <Card className="bg-white shadow-lg">
        <CardHeader className="border-b bg-gray-50 p-6">
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
                  <Bar dataKey="Dining" fill="#FFB5B5" />
                  <Bar dataKey="Takeaway" fill="#B5D8FF" />
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
