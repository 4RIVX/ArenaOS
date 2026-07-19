export const transportOptions = [
  { id: 'tr-1', type: 'metro', name: 'Metro Line 1 (Red)', waitTime: 3, destination: 'City Center', status: 'on-time' },
  { id: 'tr-2', type: 'metro', name: 'Metro Line 2 (Green)', waitTime: 8, destination: 'Airport', status: 'delayed' },
  { id: 'tr-3', type: 'bus', name: 'Shuttle Express 101', waitTime: 12, destination: 'Fan Zone A', status: 'on-time' },
  { id: 'tr-4', type: 'bus', name: 'City Bus 42', waitTime: 5, destination: 'Central Station', status: 'on-time' },
  { id: 'tr-5', type: 'taxi', name: 'Official Taxi Stand North', waitTime: 2, destination: 'Any', status: 'on-time' },
  { id: 'tr-6', type: 'taxi', name: 'Ride-Share Pick-up South', waitTime: 0, destination: 'Any', status: 'cancelled' },
] as const;