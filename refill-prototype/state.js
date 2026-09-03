// ===========================================================
// Shared prototype state — persisted in localStorage so the
// selection carries across screens/pages.
// ===========================================================

const STATE_KEY = 'refillProto.v1';

const DEFAULT_STATE = {
  savedPharmacies: [
    {
      id: 'cvs-1',
      name: 'CVS Pharmacy',
      address: '100 Summer Sunset Ave',
      city: 'Salt Lake City, Utah 84020',
      phone: '(801)-321-4567',
      type: 'retail'
    },
    {
      id: 'walgreens-1',
      name: 'Walgreens',
      address: '100 E 500 N Bluff Blvd',
      city: 'Salt Lake City, Utah 84020',
      phone: '(801) 567-0111',
      type: 'retail'
    }
  ],
  selectedPharmacyId: null,
  requestedPharmacy: null,
  requestSubmitted: false
};

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return Object.assign(structuredClone(DEFAULT_STATE), parsed);
  } catch (e) {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function resetState() {
  localStorage.removeItem(STATE_KEY);
}

function findPharmacy(state, id) {
  return state.savedPharmacies.find(p => p.id === id) || null;
}
