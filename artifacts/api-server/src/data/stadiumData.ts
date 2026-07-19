// Server-side stadium mock data for structured context retrieval.
// Mirrors frontend src/data/ files so the backend can filter and inject
// only relevant subsets into Gemini prompts — never the full dataset.

export const gates = [
  { id: 'gate-a', name: 'Gate A', crowdLevel: 'low', position: 'North', openStatus: true },
  { id: 'gate-b', name: 'Gate B', crowdLevel: 'medium', position: 'East', openStatus: true },
  { id: 'gate-c', name: 'Gate C', crowdLevel: 'high', position: 'South', openStatus: true },
  { id: 'gate-d', name: 'Gate D', crowdLevel: 'medium', position: 'West', openStatus: true },
  { id: 'gate-e', name: 'Gate E', crowdLevel: 'high', position: 'South-East', openStatus: false },
];

export const foodCourts = [
  { id: 'fc-1', name: 'Al-Majlis Grill', cuisineType: 'Middle Eastern', dietaryTags: ['Halal', 'Vegetarian-friendly'], queueTime: 12, section: 'Sector A', isOpen: true },
  { id: 'fc-2', name: 'Stadium Bites', cuisineType: 'Fast Food', dietaryTags: ['Halal'], queueTime: 25, section: 'Sector B', isOpen: true },
  { id: 'fc-3', name: 'Green Bowl', cuisineType: 'Salads & Wraps', dietaryTags: ['Vegan', 'Gluten-Free', 'Vegetarian'], queueTime: 5, section: 'Sector C', isOpen: true },
  { id: 'fc-4', name: 'Tokyo Street', cuisineType: 'Japanese', dietaryTags: ['Halal'], queueTime: 18, section: 'Sector D', isOpen: true },
  { id: 'fc-5', name: 'Cafe Express', cuisineType: 'Coffee & Snacks', dietaryTags: ['Vegetarian'], queueTime: 3, section: 'Sector A', isOpen: true },
  { id: 'fc-6', name: 'Spicy Route', cuisineType: 'Indian', dietaryTags: ['Halal', 'Vegetarian'], queueTime: 15, section: 'Sector B', isOpen: false },
];

export const transportOptions = [
  { id: 'tr-1', type: 'metro', name: 'Metro Line 1 (Red)', waitTime: 3, destination: 'City Center', status: 'on-time' },
  { id: 'tr-2', type: 'metro', name: 'Metro Line 2 (Green)', waitTime: 8, destination: 'Airport', status: 'delayed' },
  { id: 'tr-3', type: 'bus', name: 'Shuttle Express 101', waitTime: 12, destination: 'Fan Zone A', status: 'on-time' },
  { id: 'tr-4', type: 'bus', name: 'City Bus 42', waitTime: 5, destination: 'Central Station', status: 'on-time' },
  { id: 'tr-5', type: 'taxi', name: 'Official Taxi Stand North', waitTime: 2, destination: 'Any', status: 'on-time' },
  { id: 'tr-6', type: 'taxi', name: 'Ride-Share Pick-up South', waitTime: 0, destination: 'Any', status: 'cancelled' },
];

export const accessibilityFeatures = [
  { id: 'acc-1', type: 'elevator', name: 'North Main Elevator', location: 'Gate A, Level 1', isOperational: true, floor: 1 },
  { id: 'acc-2', type: 'elevator', name: 'East Service Elevator', location: 'Gate B, Level 1', isOperational: false, floor: 1 },
  { id: 'acc-3', type: 'restroom', name: 'Accessible Restroom 1A', location: 'Sector A, Level 1', isOperational: true, floor: 1 },
  { id: 'acc-4', type: 'restroom', name: 'Accessible Restroom 2C', location: 'Sector C, Level 2', isOperational: true, floor: 2 },
  { id: 'acc-5', type: 'wheelchair-route', name: 'Ramp Access East', location: 'Gate B', isOperational: true },
  { id: 'acc-6', type: 'wheelchair-route', name: 'Premium Seating Access', location: 'Sector D', isOperational: true },
  { id: 'acc-7', type: 'assistance-desk', name: 'Main Help Desk', location: 'Gate A, Ground Level', isOperational: true },
  { id: 'acc-8', type: 'assistance-desk', name: 'Medical & Assistance', location: 'Sector C, Level 1', isOperational: true },
];

export const emergencyPoints = [
  { id: 'em-1', type: 'medical', name: 'First Aid Station A', location: 'Gate A, North Concourse', level: 'full', staffed: true },
  { id: 'em-2', type: 'medical', name: 'First Aid Station B', location: 'Gate C, South Concourse', level: 'full', staffed: true },
  { id: 'em-3', type: 'medical', name: 'Medical Triage Centre', location: 'Gate B, East Wing, Level 1', level: 'advanced', staffed: true },
  { id: 'em-4', type: 'security', name: 'Security Command Post', location: 'Gate D, West Entrance', staffed: true },
  { id: 'em-5', type: 'fire', name: 'Fire Assembly Point Alpha', location: 'North Car Park, Gate A', staffed: false },
  { id: 'em-6', type: 'fire', name: 'Fire Assembly Point Bravo', location: 'South Open Area, Gate C', staffed: false },
  { id: 'em-7', type: 'lost-child', name: 'Lost & Found / Child Reunification', location: 'Gate A, Information Desk', staffed: true },
  { id: 'em-8', type: 'evacuation', name: 'Emergency Evacuation Route 1', location: 'Via Gate A and Gate B (North & East exits)', staffed: false },
  { id: 'em-9', type: 'evacuation', name: 'Emergency Evacuation Route 2', location: 'Via Gate D (West exit, least congested)', staffed: false },
];

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
];

export const stadium = {
  name: 'Lusail International Stadium',
  location: 'Lusail, Qatar',
  capacity: 88966,
  gates: ['Gate A (North)', 'Gate B (East)', 'Gate C (South)', 'Gate D (West)', 'Gate E (South-East, Staff Only)'],
  totalStaff: 2000,
  medicalTeams: 15,
  openingDate: '2021-11-21',
  currentEvent: 'FIFA World Cup 2026 Final',
};
