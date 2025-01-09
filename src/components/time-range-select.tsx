import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/select';
import { TIME_RANGES } from './dashboard';

function TimeRangeSelect({ selectedRange, setSelectedRange }) {
  return (
    <Select value={selectedRange} onValueChange={setSelectedRange}>
      <SelectTrigger className="w-full md:w-36">
        <SelectValue placeholder="Select Range" />
      </SelectTrigger>
      <SelectContent>
        {TIME_RANGES.map((range) => (
          <SelectItem key={range.value} value={range.value}>
            {range.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default TimeRangeSelect;
