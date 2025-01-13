import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../ui/select';
import { getAreas } from '@/lib/utils';

function AreaNavigation({ selectedArea, onValueChange }) {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    getAreas().then((areas) => setAreas(areas));
  }, []);

  return (
    <Select value={selectedArea} onValueChange={onValueChange}>
      <SelectTrigger className="text-gray-300 inline-flex items-center gap-2 w-full md:w-36 px-4 py-2 bg-[#5a5b6a] hover:bg-[#464756] border-none rounded-md cursor-pointer transition-colors">
        <SelectValue placeholder="Select Area" />
      </SelectTrigger>
      <SelectContent className="text-gray-300 bg-[#5a5b6a]">
        {areas.map((area) => (
          <SelectItem key={area} value={area} className="hover:bg-[#464756]">
            {area}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default AreaNavigation;
