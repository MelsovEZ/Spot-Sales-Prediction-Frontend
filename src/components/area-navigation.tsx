import { motion } from 'framer-motion';
import { AREAS, fadeIn } from './dashboard';
import { TabsList, TabsTrigger } from '@radix-ui/react-tabs';

function AreaNavigation() {
  return (
    <motion.div {...fadeIn} transition={{ duration: 0.3, delay: 0.2 }}>
      <TabsList className="grid grid-cols-1 sm:grid-cols-5 w-full h-full bg-white shadow-md rounded-lg py-4">
        {AREAS.map((area) => (
          <TabsTrigger
            key={area}
            value={area}
            className="mx-4 py-3 px-4 text-sm font-medium data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
          >
            {area}
          </TabsTrigger>
        ))}
      </TabsList>
    </motion.div>
  );
}

export default AreaNavigation;
