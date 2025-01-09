import { motion } from 'framer-motion';

function DashboardLayout({ children }) {
  return (
    <motion.div
      className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">{children}</div>
      </div>
    </motion.div>
  );
}

export default DashboardLayout;
