import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../ui/select';
import { TIME_RANGES } from './dashboard-page';

function TimeRangeSelect({ selectedRange, setSelectedRange }) {
  return (
    <Select value={selectedRange} onValueChange={setSelectedRange}>
      <SelectTrigger className="w-full md:w-36 bg-[#5a5b6a] hover:bg-[#464756] transition-colors border-none text-white">
        <SelectValue placeholder="Select Range" />
      </SelectTrigger>
      <SelectContent className="bg-[#5a5b6a] text-white">
        {TIME_RANGES.map((range) => (
          <SelectItem
            key={range.value}
            value={range.value}
            className="hover:bg-[#464756] transition-colors"
          >
            {range.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default TimeRangeSelect;
