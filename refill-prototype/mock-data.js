// ===========================================================
// Mock pharmacy search results.
// Turns whatever the tester types into plausible-looking
// retail + mail-order pharmacy results, so user testing feels
// real without needing a live pharmacy database.
// ===========================================================

const STREET_POOL = [
  { address: '100 Summer Sunset Ave', city: 'Salt Lake City, Utah' },
  { address: '482 Foothill Dr', city: 'Salt Lake City, Utah' },
  { address: '1210 S State St', city: 'Salt Lake City, Utah' },
  { address: '75 Canyon View Rd', city: 'Salt Lake City, Utah' },
  { address: '640 W North Temple', city: 'Salt Lake City, Utah' },
  { address: '2200 Parkway Blvd', city: 'Salt Lake City, Utah' }
];

// Known chain-specific naming so common searches feel authentic.
const CHAIN_PATTERNS = {
  cvs: { retail: 'CVS Pharmacy', mail: 'CVS Caremark Mail Order' },
  walgreens: { retail: 'Walgreens', mail: 'Walgreens Mail Service Pharmacy' },
  walmart: { retail: 'Walmart Pharmacy', mail: 'Walmart Pharmacy Mail Order' },
  costco: { retail: 'Costco Warehouse Pharmacy', mail: 'Costco Online Pharmacy' },
  'rite aid': { retail: 'Rite Aid Pharmacy', mail: 'Rite Aid Mail Order Pharmacy' },
  kroger: { retail: 'Kroger Pharmacy', mail: 'Kroger Mail Order Pharmacy' },
  safeway: { retail: 'Safeway Pharmacy', mail: 'Safeway Mail Order Pharmacy' },
  publix: { retail: 'Publix Pharmacy', mail: 'Publix Mail Order Pharmacy' },
  target: { retail: 'Target (CVS) Pharmacy', mail: 'CVS Caremark Mail Order' },
  'express scripts': { retail: 'Express Scripts Pharmacy', mail: 'Express Scripts Mail Order' },
  optum: { retail: 'Optum Store Pharmacy', mail: 'OptumRx Home Delivery' },
  'sams club': { retail: "Sam's Club Pharmacy", mail: "Sam's Club Pharmacy Mail Order" },
  "sam's club": { retail: "Sam's Club Pharmacy", mail: "Sam's Club Pharmacy Mail Order" }
};

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function titleCase(str) {
  return str.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

// Splits a free-text query like "Costco 84020" into { name, zip }.
function parseQuery(rawQuery) {
  const query = rawQuery.trim();
  const zipMatch = query.match(/\b\d{5}\b/);
  const zip = zipMatch ? zipMatch[0] : null;
  const name = query.replace(/\b\d{5}\b/, '').trim();
  return { name, zip };
}

function chainPatternFor(name) {
  const key = name.toLowerCase().trim();
  if (CHAIN_PATTERNS[key]) return CHAIN_PATTERNS[key];
  // partial match, e.g. "cvs pharmacy" or "walgreens on main st"
  const found = Object.keys(CHAIN_PATTERNS).find(k => key.includes(k));
  return found ? CHAIN_PATTERNS[found] : null;
}

// Returns { retail: [...], mail: [...] } pharmacy result objects.
function searchPharmacies(rawQuery) {
  const { name, zip } = parseQuery(rawQuery);
  if (!name) return { name: '', zip, retail: [], mail: [] };

  const baseName = titleCase(name.replace(/\bpharmacy\b/gi, '').trim()) || titleCase(name);
  const displayName = titleCase(name);
  const pattern = chainPatternFor(name);
  const retailLabel = pattern ? pattern.retail : `${baseName} Pharmacy`;
  const mailLabel = pattern ? pattern.mail : `${baseName} Online Pharmacy`;

  const seed = hashString(name.toLowerCase());
  const zipDisplay = zip || '84020';

  const streetsFor = (offset) => {
    const idx = (seed + offset) % STREET_POOL.length;
    return STREET_POOL[idx];
  };

  const phoneFor = (offset) => {
    const exch = (seed + offset * 7) % 900 + 100;
    const line = (seed + offset * 13) % 9000 + 1000;
    return `(801) ${exch}-${line}`;
  };

  const loc1 = streetsFor(0);
  const loc2 = streetsFor(1);
  const loc3 = streetsFor(2);

  const retail = [
    {
      id: `search-retail-1-${seed}`,
      name: retailLabel,
      address: loc1.address,
      city: `${loc1.city} ${zipDisplay}`,
      phone: phoneFor(1),
      type: 'retail'
    },
    {
      id: `search-retail-2-${seed}`,
      name: retailLabel,
      address: loc2.address,
      city: `${loc2.city} ${zipDisplay}`,
      phone: phoneFor(2),
      type: 'retail'
    }
  ];

  const mail = [
    {
      id: `search-mail-1-${seed}`,
      name: mailLabel,
      address: loc3.address,
      city: `${loc3.city} ${zipDisplay}`,
      phone: phoneFor(3),
      type: 'mail'
    }
  ];

  return { name: displayName, zip: zipDisplay, retail, mail };
}
