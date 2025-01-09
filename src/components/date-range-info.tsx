import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { fadeIn } from './dashboard';

function DateRangeInfo({ startDate, endDate }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day} ${year}`;
  };

  return (
    <motion.div {...fadeIn} transition={{ duration: 0.3, delay: 0.1 }}>
      <Card className="bg-white shadow">
        <CardHeader className="border-b bg-gray-50 p-6">
          <CardTitle className="text-xl text-gray-800">
            Date Range Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700">
            Showing data from{' '}
            <span className="font-medium">{formatDate(startDate)}</span> to{' '}
            <span className="font-medium">{formatDate(endDate)}</span>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default DateRangeInfo;
