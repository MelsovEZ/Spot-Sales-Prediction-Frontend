import { motion } from 'framer-motion';

function OrdersCounter({ totalOrders }) {
  return (
    <motion.div
      className="text-base md:text-lg"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      Total Orders:{' '}
      <span className="font-bold text-gray-900">
        {totalOrders.toLocaleString()}
      </span>
    </motion.div>
  );
}

export default OrdersCounter;
