import { motion } from 'framer-motion';

function OrdersCounter({ totalOrders, startDate, endDate }) {
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
    <motion.div
      className="text-gray-300"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      Total Orders:{' '}
      <span className="font-bold text-gray-300">
        {totalOrders.toLocaleString()}

        <p className="text-gray-300">
          Showing data from{' '}
          <span className="font-medium">{formatDate(startDate)}</span> to{' '}
          <span className="font-medium">{formatDate(endDate)}</span>
        </p>
      </span>
    </motion.div>
  );
}

export default OrdersCounter;
