// Quick test script
function normalizeTime(timeString: string): string {
  let time = timeString.trim();
  time = time.replace(/[–—−]/g, '-');
  time = time.replace(/\b([ap])\.?m\.?/gi, (match, period) => period.toLowerCase() + 'm');
  time = time.replace(/\s+/g, ' ');

  if (!/[ap]m/i.test(time)) {
    const noAmPmPattern = /(\d{1,2}):\s*(\d{2})\s*-\s*(\d{1,2}):\s*(\d{2})/;
    const match = time.match(noAmPmPattern);
    
    if (match) {
      let startHour = parseInt(match[1]);
      const startMin = match[2];
      let endHour = parseInt(match[3]);
      const endMin = match[4];

      const formatTime = (hour: number): { hour: number; period: string } => {
        if (hour === 0) return { hour: 12, period: 'am' };
        if (hour === 12) return { hour: 12, period: 'pm' };
        if (hour >= 13 && hour <= 23) return { hour: hour - 12, period: 'pm' };
        return { hour, period: 'am' };
      };

      let start = formatTime(startHour);
      let end = formatTime(endHour);

      // If start is morning (1-11) and end is 1-11
      if (startHour >= 1 && startHour <= 11 && endHour >= 1 && endHour <= 11) {
        // If end < start, end is PM (e.g., 9 AM - 1 PM)
        if (endHour < startHour) {
          end.period = 'pm';
        } else {
          // If end >= start, also PM for afternoon sessions
          end.period = 'pm';
        }
      }
      // If start is 12 (noon), end is PM
      else if (startHour === 12 && endHour >= 1 && endHour <= 11) {
        end.period = 'pm';
      }

      return `${start.hour.toString().padStart(2, '0')}:${startMin} ${start.period} - ${end.hour.toString().padStart(2, '0')}:${endMin} ${end.period}`;
    }
  }

  return time;
}

console.log('Test 1:', normalizeTime('09: 30 – 01:30')); // Should be: 09:30 am - 01:30 pm
console.log('Test 2:', normalizeTime('02:30 – 3:30')); // Should be: 02:30 pm - 03:30 pm
console.log('Test 3:', normalizeTime('12:30 – 1:00')); // Should be: 12:30 pm - 01:00 pm

