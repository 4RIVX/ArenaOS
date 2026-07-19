export const sustainabilityPoints = [
  { id: 'sus-1', type: 'water-refill', name: 'Refill Station A', location: 'Sector A, near Gate A', isOperational: true },
  { id: 'sus-2', type: 'water-refill', name: 'Refill Station B', location: 'Sector C, Level 2', isOperational: true },
  { id: 'sus-3', type: 'water-refill', name: 'Refill Station C', location: 'Gate B, East Concourse', isOperational: false },
  { id: 'sus-4', type: 'recycling', name: 'Recycling Hub A', location: 'Sector A, Food Court Zone', categories: ['Plastic', 'Paper', 'Glass'], isOperational: true },
  { id: 'sus-5', type: 'recycling', name: 'Recycling Hub B', location: 'Sector B, Main Concourse', categories: ['Plastic', 'Metal'], isOperational: true },
  { id: 'sus-6', type: 'recycling', name: 'Recycling Hub C', location: 'Gate D, West Exit', categories: ['General', 'Plastic'], isOperational: true },
  { id: 'sus-7', type: 'green-exit', name: 'Green Exit – Metro Link', location: 'Gate A North, 50m to Metro Line 1', co2SavedKg: 2.1, notes: 'Lowest carbon option' },
  { id: 'sus-8', type: 'green-exit', name: 'Green Exit – Shuttle Zone', location: 'Gate C South, Electric Shuttle Bay', co2SavedKg: 1.4, notes: 'Electric shuttles only' },
  { id: 'sus-9', type: 'composting', name: 'Compost Drop-off', location: 'Gate B East, behind Food Court Row', isOperational: true },
] as const;
