export const zones = [
  { id: 'zone_a', name: 'North Stand', density: 78, waitTime: 6, status: 'high' },
  { id: 'zone_b', name: 'South Gate', density: 34, waitTime: 2, status: 'normal' },
  { id: 'zone_c', name: 'Food Court', density: 91, waitTime: 12, status: 'critical' },
  { id: 'zone_d', name: 'East Entry', density: 45, waitTime: 3, status: 'normal' },
  { id: 'zone_e', name: 'West Stand', density: 62, waitTime: 5, status: 'high' }
];

export const alerts = [
  { id: 1, zone: 'Food Court', severity: 'HIGH', message: 'Density at 91 percent', time: '2 mins ago' },
  { id: 2, zone: 'North Stand', severity: 'MED', message: 'Wait time rising', time: '5 mins ago' },
  { id: 3, zone: 'East Entry', severity: 'LOW', message: 'Minor congestion', time: '8 mins ago' }
];

export const match = {
  home: 'Mumbai Indians',
  away: 'Chennai Super Kings',
  score: '142 / 6',
  timeLeft: '18 mins',
  inning: '2nd Inning',
  venue: 'Wankhede Stadium'
};