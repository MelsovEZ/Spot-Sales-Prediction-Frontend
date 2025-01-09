import { Card, CardContent } from '@/components/card';
import { motion } from 'framer-motion';
import { fadeIn } from './dashboard';
import Image from 'next/image';
import TimeRangeSelect from './time-range-select';
import OrdersCounter from './orders-count';

function DashboardHeader({ totalOrders, selectedRange, setSelectedRange }) {
  return (
    <motion.div {...fadeIn} transition={{ duration: 0.3 }}>
      <Card className="bg-white shadow">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
            <div className="flex items-center gap-4">
              <Image src="/logo.svg" alt="logo" width={50} height={50} />
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#cb3526]">
                Dashboard
              </h1>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full md:w-auto">
              <TimeRangeSelect
                selectedRange={selectedRange}
                setSelectedRange={setSelectedRange}
              />
              <OrdersCounter totalOrders={totalOrders} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default DashboardHeader;
