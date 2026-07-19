export const accessibilityFeatures = [
  { id: 'acc-1', type: 'elevator', name: 'North Main Elevator', location: 'Gate A', isOperational: true, floor: 1 },
  { id: 'acc-2', type: 'elevator', name: 'East Service Elevator', location: 'Gate B', isOperational: false, floor: 1 },
  { id: 'acc-3', type: 'restroom', name: 'Accessible Restroom 1A', location: 'Sector A', isOperational: true, floor: 1 },
  { id: 'acc-4', type: 'restroom', name: 'Accessible Restroom 2C', location: 'Sector C', isOperational: true, floor: 2 },
  { id: 'acc-5', type: 'wheelchair-route', name: 'Ramp Access East', location: 'Gate B', isOperational: true },
  { id: 'acc-6', type: 'wheelchair-route', name: 'Premium Seating Access', location: 'Sector D', isOperational: true },
  { id: 'acc-7', type: 'assistance-desk', name: 'Main Help Desk', location: 'Gate A', isOperational: true },
  { id: 'acc-8', type: 'assistance-desk', name: 'Medical & Assistance', location: 'Sector C', isOperational: true },
] as const;