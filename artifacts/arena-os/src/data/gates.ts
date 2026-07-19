export const gates = [
  { id: 'gate-a', name: 'Gate A', crowdLevel: 'low', position: 'North', openStatus: true },
  { id: 'gate-b', name: 'Gate B', crowdLevel: 'medium', position: 'East', openStatus: true },
  { id: 'gate-c', name: 'Gate C', crowdLevel: 'high', position: 'South', openStatus: true },
  { id: 'gate-d', name: 'Gate D', crowdLevel: 'medium', position: 'West', openStatus: true },
  { id: 'gate-e', name: 'Gate E', crowdLevel: 'high', position: 'South-East', openStatus: false },
] as const;