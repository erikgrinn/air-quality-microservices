const stateCities = {
  "AL": "Birmingham",
  "AK": "Anchorage",
  "AZ": "Phoenix",
  "AR": "Little Rock",
  "CA": "Los Angeles",
  "CO": "Denver",
  "CT": "Bridgeport",
  "DE": "Wilmington",
  "FL": "Jacksonville",
  "GA": "Atlanta",
  "HI": "Honolulu",
  "ID": "Boise",
  "IL": "Chicago",
  "IN": "Indianapolis",
  "IA": "Des Moines",
  "KS": "Wichita",
  "KY": "Louisville",
  "LA": "New Orleans",
  "ME": "Portland",
  "MD": "Baltimore",
  "MA": "Boston",
  "MI": "Detroit",
  "MN": "Minneapolis",
  "MS": "Jackson",
  "MO": "Kansas City",
  "MT": "Billings",
  "NE": "Omaha",
  "NV": "Las Vegas",
  "NH": "Manchester",
  "NJ": "Newark",
  "NM": "Albuquerque",
  "NY": "New York City",
  "NC": "Charlotte",
  "ND": "Fargo",
  "OH": "Columbus",
  "OK": "Oklahoma City",
  "OR": "Portland",
  "PA": "Philadelphia",
  "RI": "Providence",
  "SC": "Charleston",
  "SD": "Sioux Falls",
  "TN": "Nashville",
  "TX": "Houston",
  "UT": "Salt Lake City",
  "VT": "Burlington",
  "VA": "Virginia Beach",
  "WA": "Seattle",
  "WV": "Charleston",
  "WI": "Milwaukee",
  "WY": "Cheyenne"
};

function getMajorCity(stateAbbreviation) {
  return stateCities[stateAbbreviation.toUpperCase()] || null;
}

function getStateByCity(city) {
  const entry = Object.entries(stateCities).find(([abbr, majorCity]) => majorCity.toLowerCase() === city.toLowerCase());
  return entry ? entry[0] : null;
}

export { getMajorCity, getStateByCity };
// export default getMajorCity