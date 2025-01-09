import { motion } from 'framer-motion';
import CategoryChart from './category-chart';
import OrderTypeChart from './order-chart';

function ChartsSection({ categoryData, orderTypeData }) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CategoryChart data={categoryData} />
      <OrderTypeChart data={orderTypeData} />
    </motion.div>
  );
}

export default ChartsSection;
