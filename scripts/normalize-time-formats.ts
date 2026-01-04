import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Normalize time formats in JSON file
 * Standard format: "HH:mm am - HH:mm pm" (with spaces around dash, lowercase am/pm, leading zeros)
 */

function normalizeTime(timeString: string): string {
  if (!timeString || typeof timeString !== 'string') {
    return timeString;
  }

  let time = timeString.trim();

  // Replace different dash types (em dash, en dash, regular dash) with regular dash
  time = time.replace(/[–—−]/g, '-');

  // Normalize am/pm variations (a.m., a.m, AM, am, A.M., etc.) to lowercase am/pm
  time = time.replace(/\b([ap])\.?m\.?/gi, (match, period) => {
    return period.toLowerCase() + 'm';
  });

  // Remove all extra spaces first
  time = time.replace(/\s+/g, ' ');

  // Pattern 1: Has am/pm markers
  if (/[ap]m/i.test(time)) {
    // Extract times with am/pm - handle various formats
    // Match patterns like: "09:30am-01:00pm", "09:30 am - 01:00 pm", "9:30 AM - 1:00 PM", etc.
    const ampmPattern = /(\d{1,2}):\s*(\d{2})\s*([ap]m)\s*-\s*(\d{1,2}):\s*(\d{2})\s*([ap]m)/i;
    const match = time.match(ampmPattern);
    
    if (match) {
      const startHour = parseInt(match[1]);
      const startMin = match[2];
      const startPeriod = match[3].toLowerCase();
      const endHour = parseInt(match[4]);
      const endMin = match[5];
      const endPeriod = match[6].toLowerCase();

      // Format with leading zeros
      return `${startHour.toString().padStart(2, '0')}:${startMin} ${startPeriod} - ${endHour.toString().padStart(2, '0')}:${endMin} ${endPeriod}`;
    }

    // Try pattern without spaces: "09:30am-01:00pm"
    const noSpacePattern = /(\d{1,2}):(\d{2})([ap]m)-(\d{1,2}):(\d{2})([ap]m)/i;
    const noSpaceMatch = time.match(noSpacePattern);
    
    if (noSpaceMatch) {
      const startHour = parseInt(noSpaceMatch[1]);
      const startMin = noSpaceMatch[2];
      const startPeriod = noSpaceMatch[3].toLowerCase();
      const endHour = parseInt(noSpaceMatch[4]);
      const endMin = noSpaceMatch[5];
      const endPeriod = noSpaceMatch[6].toLowerCase();

      return `${startHour.toString().padStart(2, '0')}:${startMin} ${startPeriod} - ${endHour.toString().padStart(2, '0')}:${endMin} ${endPeriod}`;
    }
  } else {
    // Pattern 2: No am/pm markers (24-hour format or implicit)
    // Match patterns like: "09:00 – 09:30", "09: 30 – 01:30", "2:30 – 3:30"
    const noAmPmPattern = /(\d{1,2}):\s*(\d{2})\s*-\s*(\d{1,2}):\s*(\d{2})/;
    const match = time.match(noAmPmPattern);
    
    if (match) {
      let startHour = parseInt(match[1]);
      const startMin = match[2];
      let endHour = parseInt(match[3]);
      const endMin = match[4];

      // Convert 24-hour to 12-hour format
      // Determine AM/PM based on context
      const formatTime = (hour: number, min: string): { hour: number; period: string } => {
        let h = hour;
        let period = 'am';
        
        // If hour is 0 (midnight), it's 12 am
        if (h === 0) {
          h = 12;
          period = 'am';
        }
        // If hour is 12, it's 12 pm (noon)
        else if (h === 12) {
          period = 'pm';
        }
        // If hour is 13-23 (1pm-11pm in 24-hour), convert to 12-hour PM
        else if (h >= 13 && h <= 23) {
          h = h - 12;
          period = 'pm';
        }
        // For hours 1-11, default to AM (will be adjusted based on context)
        else {
          period = 'am';
        }
        
        return { hour: h, period };
      };

      let start = formatTime(startHour, startMin);
      let end = formatTime(endHour, endMin);

      // Determine AM/PM based on context for hours 1-11
      // If start hour is 1-11 (morning), determine if end should be PM
      if (startHour >= 1 && startHour <= 11) {
        // If end hour is also 1-11
        if (endHour >= 1 && endHour <= 11) {
          // If end hour is less than start hour, end is PM (e.g., 9 AM - 1 PM)
          if (endHour < startHour) {
            end.period = 'pm';
          }
          // If end hour >= start hour and start is morning, end could be AM or PM
          // For schedules, if start is morning and end is later same hour or next hours, 
          // it's typically still morning (AM) unless it's clearly afternoon
          // But if start is 9 and end is 1, that's clearly 1 PM
          // Actually, if start is 9 AM and end is 1-11, it's likely PM (afternoon)
          if (endHour >= startHour) {
            // In training schedules, if start is 9 AM and end is 1-11, it's typically PM
            end.period = 'pm';
          }
        }
      }
      // If start hour is 12 (noon), end is PM
      else if (startHour === 12) {
        end.period = 'pm';
        if (endHour >= 1 && endHour <= 11) {
          end.period = 'pm';
        }
      }
      // If start hour is 13-23 (1pm-11pm), end is PM
      else if (startHour >= 13 && startHour <= 23) {
        end.period = 'pm';
        if (endHour >= 1 && endHour <= 11) {
          end.period = 'pm';
        }
      }

      return `${start.hour.toString().padStart(2, '0')}:${startMin} ${start.period} - ${end.hour.toString().padStart(2, '0')}:${endMin} ${end.period}`;
    }
  }

  // If no pattern matched, ensure at least spaces around dash
  time = time.replace(/\s*-\s*/g, ' - ');
  time = time.replace(/\s+/g, ' ').trim();

  return time;
}

function normalizeJSONTimeFields(data: any): any {
  if (Array.isArray(data)) {
    return data.map(item => normalizeJSONTimeFields(item));
  } else if (data && typeof data === 'object') {
    const normalized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === 'time' && typeof value === 'string') {
        normalized[key] = normalizeTime(value);
      } else {
        normalized[key] = normalizeJSONTimeFields(value);
      }
    }
    return normalized;
  }
  return data;
}

async function main() {
  const filePath = resolve(process.cwd(), '../../test.trainings.json');
  
  try {
    console.log('Reading JSON file...');
    const fileContent = readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    console.log('Normalizing time formats...');
    const normalizedData = normalizeJSONTimeFields(jsonData);

    console.log('Writing normalized JSON back to file...');
    writeFileSync(filePath, JSON.stringify(normalizedData, null, 2), 'utf-8');

    console.log('✓ Time formats normalized successfully!');
    console.log(`File saved to: ${filePath}`);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
