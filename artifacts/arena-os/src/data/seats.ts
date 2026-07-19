export const seatSections = [
  { id: 'sec-1', section: '101', row: 'A', startSeat: 1, endSeat: 50, level: 'lower', accessibleSeating: true },
  { id: 'sec-2', section: '102', row: 'A', startSeat: 1, endSeat: 50, level: 'lower', accessibleSeating: false },
  { id: 'sec-3', section: '201', row: 'A', startSeat: 1, endSeat: 60, level: 'middle', accessibleSeating: true },
  { id: 'sec-4', section: '202', row: 'A', startSeat: 1, endSeat: 60, level: 'middle', accessibleSeating: false },
  { id: 'sec-5', section: '301', row: 'A', startSeat: 1, endSeat: 80, level: 'upper', accessibleSeating: false },
  { id: 'sec-6', section: '302', row: 'A', startSeat: 1, endSeat: 80, level: 'upper', accessibleSeating: false },
] as const;