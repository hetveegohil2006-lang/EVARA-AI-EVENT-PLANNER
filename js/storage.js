/**
 * EVARA Private Concierge — Enterprise Firestore Storage & Data Engine
 * Manages 13 distinct Firestore collections, user authentication binding,
 * optimistic local caching, and multi-module data consistency.
 */

// 1. Firestore Collection Constants
const COLLECTIONS = {
  USERS: 'users',
  USER_PROFILES: 'userProfiles',
  EVENTS: 'events',
  EVENT_PARTICIPANTS: 'eventParticipants',
  GUEST_REGISTRATIONS: 'guestRegistrations',
  GUEST_CONTRIBUTIONS: 'guestContributions',
  BUDGETS: 'budgets',
  EXPENSES: 'expenses',
  CHECKLIST_TASKS: 'checklistTasks',
  VENDORS: 'vendors',
  VENDOR_SELECTIONS: 'vendorSelections',
  SHOPPING_LISTS: 'shoppingLists',
  INVITATIONS: 'invitations',
  NOTIFICATIONS: 'notifications'
};

// 2. Storage Keys for UI Module State
const STORAGE_KEYS = {
  USER: 'user',
  USER_PROFILE: 'userProfile',
  EVENTS: 'events',
  CURRENT_EVENT_ID: 'currentEventId',
  GUESTS: 'guests',
  CONTRIBUTIONS: 'contributions',
  BUDGET: 'budget',
  EXPENSES: 'expenses',
  CHECKLIST: 'checklist',
  VENDORS: 'vendors',
  VENDOR_SELECTIONS: 'vendorSelections',
  SHOPPING: 'shopping',
  INVITATIONS: 'invitations',
  NOTIFICATIONS: 'notifications'
};

// 3. Default Curated Dataset for Seed Initialization
const DEFAULT_USER = {
  uid: "usr-eleanor-vance",
  name: "Eleanor Vance",
  email: "eleanor.vance@atelier.com",
  role: "Principal Host & Patron",
  title: "Principal Host & Patron",
  phone: "+39 340 9823412",
  avatar: "EV",
  kycStatus: "Verified"
};

const DEFAULT_EVENTS = [
  {
    id: "evt-tuscan-gala-2025",
    title: "Villa San Valentino Tuscan Gala 2025",
    archetype: "Tuscan Gala & Wedding",
    dates: "Oct 24–27, 2025",
    startDate: "2025-10-24",
    endDate: "2025-10-27",
    location: "Villa San Valentino, Chianti Hills, Tuscany, Italy",
    venue: "Villa San Valentino, Chianti Hills, Tuscany, Italy",
    targetBudget: 1500000,
    guestCount: 36,
    capacity: 45,
    status: "Planning Active",
    readiness: "75% Calibrated",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRlbWQJd7ix7X_HIBg4iwVHRQ2tfxZEQ9PlMHfoC2TtLGvtJgdn93WzONEIasNIGhLKaD7rSvu9wLmuiRRgkC-gldG34BdpZ8HV_SFQoewlkFGcmvXRqEonsxFuhXX-wh2HsZeSfkB6AaT2qAa06Za85AL0z4w61LmL0_YixPd2V49eRmx7oaSCxS__G0qZMvbHZG_EZrHLf6ecBb2rQOmRX3uefAwqkWACy7ft4k"
  },
  {
    id: "evt-cap-dantibes-2025",
    title: "Cap d’Antibes Solstice Birthday",
    archetype: "Private Coastal Retreat",
    dates: "Jul 14–16, 2025",
    startDate: "2025-07-14",
    endDate: "2025-07-16",
    location: "Cap d’Antibes, French Riviera",
    venue: "Villa Eilenroc, Cap d’Antibes",
    targetBudget: 850000,
    guestCount: 24,
    capacity: 30,
    status: "Executed",
    readiness: "100% Completed",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCoKIpmSrrmsUFK_KkwTgrenPcK6xN8dftD0pCZki6MlCA-zpnmlyCA1huwW94isQsNfPr-8VWXyhUhXDcMrTninx_dRD7-gXKBUsRxq6WlRybJcgGpzrKM1PtyawAGf_Dv9ys8VSZ7P43VYgOkoGwr7r68YLnZHzN-HnTrXrizLX7Evsi_WUSF--Bq_FN8we9ICtLkll_YYwK-WKc4jaa_DUwkfk3hJfm-0VYD04"
  },
  {
    id: "evt-st-moritz-2026",
    title: "St. Moritz Alpine Winter Summit",
    archetype: "Executive Leadership Summit",
    dates: "Jan 18–22, 2026",
    startDate: "2026-01-18",
    endDate: "2026-01-22",
    location: "St. Moritz, Engadin Valley, Switzerland",
    venue: "Badrutt's Palace Suite",
    targetBudget: 2200000,
    guestCount: 16,
    capacity: 20,
    status: "Upcoming 2026",
    readiness: "30% Initiated",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvjZQItqiS8GJ3QchcKVAHePoS18FihFoH1Bmagr6yAPsLwUNiaxnltiY05dq-UurSr80BIpwmOKL3jPnyYoXYdsPfPIXJNsN_6sKyeKCKjB0uDR_aNi4DL_TsyTYqfqXcERQgGBqON19SarToHP3WzG3aKCMYv5pRwp_oRi9XCg9-pshuKy12_etdLmsvishFmK-dZ_9cFKs7kNF5HYbWn5yNgrkb50F5Epk53kc"
  }
];

const DEFAULT_GUESTS = [
  {
    id: "gst-1",
    name: "Eleanor Vance",
    email: "eleanor.vance@atelier.com",
    phone: "+39 340 9823412",
    pax: 2,
    rsvp: "Confirmed",
    table: "Villa Suite 1",
    suite: "Villa Suite 1",
    dietary: "Pescatarian",
    contribution: 41666,
    paymentStatus: "Settled"
  },
  {
    id: "gst-2",
    name: "Julian Sterling",
    email: "julian.sterling@sterlingops.com",
    phone: "+44 7700 900142",
    pax: 2,
    rsvp: "Confirmed",
    table: "Villa Suite 2",
    suite: "Villa Suite 2",
    dietary: "None",
    contribution: 41666,
    paymentStatus: "Settled"
  },
  {
    id: "gst-3",
    name: "Sofia Sterling",
    email: "sofia.s@atelier.com",
    phone: "+44 7700 900143",
    pax: 1,
    rsvp: "Confirmed",
    table: "Villa Suite 3",
    suite: "Villa Suite 3",
    dietary: "Vegetarian",
    contribution: 41666,
    paymentStatus: "Settled"
  },
  {
    id: "gst-4",
    name: "Matteo Bellini",
    email: "matteo.b@florencestrings.it",
    phone: "+39 333 4519028",
    pax: 2,
    rsvp: "Confirmed",
    table: "Villa Suite 4",
    suite: "Villa Suite 4",
    dietary: "Gluten-Free",
    contribution: 41666,
    paymentStatus: "Settled"
  },
  {
    id: "gst-5",
    name: "Dr. Clara Dupont",
    email: "clara.dupont@sorbonne.fr",
    phone: "+33 6 12 34 56 78",
    pax: 2,
    rsvp: "Confirmed",
    table: "Villa Suite 5",
    suite: "Villa Suite 5",
    dietary: "Vegan",
    contribution: 41666,
    paymentStatus: "Settled"
  },
  {
    id: "gst-6",
    name: "Alessandro Moretti",
    email: "alessandro@chiantiselect.it",
    phone: "+39 347 8829104",
    pax: 1,
    rsvp: "Confirmed",
    table: "Guest House A",
    suite: "Guest House A",
    dietary: "None",
    contribution: 41666,
    paymentStatus: "Settled"
  },
  {
    id: "gst-7",
    name: "Lady Genevieve Fox",
    email: "genevieve.fox@mayfairholdings.co.uk",
    phone: "+44 20 7946 0921",
    pax: 2,
    rsvp: "Pending",
    table: "Villa Suite 6",
    suite: "Villa Suite 6",
    dietary: "Nut Allergy",
    contribution: 41666,
    paymentStatus: "Pending Escrow"
  },
  {
    id: "gst-8",
    name: "Marcus Vance",
    email: "marcus.v@nyccapital.com",
    phone: "+1 212 555 0192",
    pax: 1,
    rsvp: "Confirmed",
    table: "Guest House B",
    suite: "Guest House B",
    dietary: "None",
    contribution: 41666,
    paymentStatus: "Settled"
  },
  {
    id: "gst-9",
    name: "Camille Laurent",
    email: "camille.laurent@artcurial.fr",
    phone: "+33 6 98 76 54 32",
    pax: 1,
    rsvp: "Pending",
    table: "Villa Suite 7",
    suite: "Villa Suite 7",
    dietary: "Lactose-Free",
    contribution: 41666,
    paymentStatus: "Pending Escrow"
  }
];

const DEFAULT_EXPENSES = [
  {
    id: "exp-1",
    title: "Castello San Valentino Main Lawn & Courtyard Fee",
    category: "Venue",
    amount: 520000,
    payee: "San Valentino Estates S.r.l.",
    status: "Paid",
    date: "2025-08-15"
  },
  {
    id: "exp-2",
    title: "Five-Course Courtyard Feast & Sommelier Flight",
    category: "Catering",
    amount: 255000,
    payee: "Fabrizio Rossi Atelier",
    status: "Paid",
    date: "2025-09-02"
  },
  {
    id: "exp-3",
    title: "Festoon Lighting Rigging & Fairy Canopy (500m)",
    category: "Decoration",
    amount: 145000,
    payee: "Luce & Ombra Illumination",
    status: "Pending Escrow",
    date: "2025-09-18"
  },
  {
    id: "exp-4",
    title: "Airport Sprinter Transfer Fleet (Florence FLR ↔ Villa)",
    category: "Transportation",
    amount: 125000,
    payee: "Tuscan Heritage Sprinters",
    status: "Pending Escrow",
    date: "2025-09-22"
  },
  {
    id: "exp-5",
    title: "Chamber String Quartet for Twilight Lawn Spritz",
    category: "Entertainment",
    amount: 95000,
    payee: "Chianti Strings Quartet",
    status: "Remitted",
    date: "2025-09-28"
  }
];

const DEFAULT_CHECKLIST = [
  {
    id: "tsk-1",
    title: "Escrow Milestone 1 to Villa San Valentino Released",
    category: "Escrow",
    dueDate: "2025-10-10",
    completed: true,
    assignedTo: "Eleanor Vance",
    priority: "Urgent"
  },
  {
    id: "tsk-2",
    title: "Courtyard festoon canopy & acoustic rigging sign-off",
    category: "Logistics",
    dueDate: "2025-10-23",
    completed: true,
    assignedTo: "Matteo Bellini",
    priority: "High"
  },
  {
    id: "tsk-3",
    title: "Chianti Classico tasting sample sign-off with Chef Fabrizio",
    category: "Hospitality",
    dueDate: "2025-10-24",
    completed: false,
    assignedTo: "Julian Sterling",
    priority: "High"
  },
  {
    id: "tsk-4",
    title: "Arrival Gate VIP Sprinter Transit FLR flight arrivals",
    category: "Logistics",
    dueDate: "2025-10-24",
    completed: false,
    assignedTo: "Tuscan Sprinters",
    priority: "Normal"
  },
  {
    id: "tsk-5",
    title: "Courtyard Gala Welcome Spritz & String Quartet soundcheck",
    category: "Milestone",
    dueDate: "2025-10-24",
    completed: false,
    assignedTo: "Chianti Strings",
    priority: "High"
  },
  {
    id: "tsk-6",
    title: "Escrow Milestone 2 Release to Chef Fabrizio Rossi",
    category: "Escrow",
    dueDate: "2025-10-25",
    completed: false,
    assignedTo: "Eleanor Vance",
    priority: "Urgent"
  }
];

const DEFAULT_VENDORS = [
  {
    id: "vnd-1",
    name: "Fiori di Firenze",
    category: "Floral & Pergola Installations",
    rating: 4.9,
    reviews: 64,
    priceTier: "€€€€ Luxury Tier",
    location: "Florence, Italy",
    tags: ["Heirloom Garden Roses", "Pergola Rigging", "Olive Branch Garlands"],
    status: "Booked & Escrowed",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaEHVJI7v29ejZK2Vwvg7qqirijBKMwIYuOPHF6OgqJUnZQH9ZLoipYEj0DOsmCOSAu2QRQM_de9mL8oYajj4JPxBMLyuFS-4TybPvZG1Hc0qg9ZXcvWHmiczVNKaRfhzAm9Nz-JYq9K0wsKF5xvfi1OZA-t_pMs_GvZih7hzMyY_aSRX6acvx0j9zS3_5EoR8U0wDkVPCwBMT7QTbbMlBXB3lwc1qJ07XIg9yJLA"
  },
  {
    id: "vnd-2",
    name: "Chianti Strings Quartet",
    category: "Classical Strings & Acoustic",
    rating: 5.0,
    reviews: 48,
    priceTier: "€€€ Bespoke Tier",
    location: "Siena, Tuscany",
    tags: ["Puccini Repertoire", "Vivaldi Twilight", "Wireless Amplification"],
    status: "Booked & Escrowed",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRlbWQJd7ix7X_HIBg4iwVHRQ2tfxZEQ9PlMHfoC2TtLGvtJgdn93WzONEIasNIGhLKaD7rSvu9wLmuiRRgkC-gldG34BdpZ8HV_SFQoewlkFGcmvXRqEonsxFuhXX-wh2HsZeSfkB6AaT2qAa06Za85AL0z4w61LmL0_YixPd2V49eRmx7oaSCxS__G0qZMvbHZG_EZrHLf6ecBb2rQOmRX3uefAwqkWACy7ft4k"
  },
  {
    id: "vnd-3",
    name: "Chef Fabrizio Rossi Atelier",
    category: "Sommelier & Banquet Feasts",
    rating: 4.9,
    reviews: 92,
    priceTier: "€€€€ Michelin Pedigree",
    location: "Chianti Hills, Italy",
    tags: ["Tuscan Bistecca", "Truffle Tagliolini", "Sommelier Wine Pairings"],
    status: "Shortlisted",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4LnXLHk2TGpv8MO362oPAdywzYLCJ-7-iOaHiDfEGB7D8V6W35HXQIMG2GuF9pCxwnPb_ntnhkynTJIfuSlCu75svpRNgfzxBYP9zqe1kelgZdetYc9Qp5qPmlyqRsFFsWpMsGwJWV9Vxh9gMcaI63yt8dny9rLki5dJ0-2a2mu_t1RzT0rhj7jEKhwkpuHUsxy2q7al4p4cAQDV4EOhUVf_UJSvetx9_oeMrHcA"
  },
  {
    id: "vnd-4",
    name: "Luce & Ombra Illumination",
    category: "Architectural & Festoon Rigging",
    rating: 4.9,
    reviews: 37,
    priceTier: "€€€ Standard Luxury",
    location: "Arezzo, Italy",
    tags: ["Warm Festoon 2200K", "Candle Wall Sconces", "Silent Generator Backup"],
    status: "Shortlisted",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_lJKilqzQz2AM1V9uAcF80Cp6TcCb3bWi4k5Gg29FotPpcnGtvwVvqpbquqtPA2OgLq3_lf5CxnhFXu4O8Xzdp_u3nTZw_14Nzph80GFvOKtQ2UU-pdzc2IlqRGffC3kpKGoC6JvmTls1ahzzIY6tdS9UVoCw37m272Z8rGVICaMrxVpJEPfe8lBfrHdw-PpbvDcdzoOeeoNr7H3J2ITICYXPDCbRuHwHdR_cKmk"
  }
];

const DEFAULT_SHOPPING = [
  {
    id: "shp-1",
    name: "Tuscan Terracotta Urns & Planters (Set of 4)",
    category: "Decor",
    merchant: "Etsy Artisan Direct",
    price: 8500,
    qty: 4,
    purchased: true,
    assignedTo: "Sofia Sterling"
  },
  {
    id: "shp-2",
    name: "Hand-Poured Cypress & Fig Candles in Brass Vessels",
    category: "Stationery & Favors",
    merchant: "Florentine Workshop",
    price: 1850,
    qty: 36,
    purchased: true,
    assignedTo: "Eleanor Vance"
  },
  {
    id: "shp-3",
    name: "Commercial Warm Festoon Light Bulbs (50m String)",
    category: "Lighting",
    merchant: "Amazon Business Prime",
    price: 14200,
    qty: 2,
    purchased: false,
    assignedTo: "Matteo Bellini"
  },
  {
    id: "shp-4",
    name: "Cold Stage Sparkler Fountains (Indoor / Outdoor Safe)",
    category: "Special Effects",
    merchant: "Pyrotech Milano",
    price: 22000,
    qty: 1,
    purchased: false,
    assignedTo: "Julian Sterling"
  },
  {
    id: "shp-5",
    name: "Bespoke Calligraphy Place Cards & Gold Leaf Menus",
    category: "Stationery",
    merchant: "Atelier Press Mayfair",
    price: 12500,
    qty: 1,
    purchased: true,
    assignedTo: "Eleanor Vance"
  }
];

const DEFAULT_INVITATION = {
  id: "inv-tuscan-gala-2025",
  title: "The Solstice Tuscan Gala",
  hosts: "Eleanor Vance & Friends",
  dates: "October 24–27, 2025",
  venue: "Castello di San Valentino, Tuscany",
  message: "Under the golden cypress canopy of Villa San Valentino, we request the honor of your company for three sunlit evenings of Chianti tastings, chamber strings, and starlit gastronomy.",
  theme: "champagne",
  vipLink: "https://evara.atelier/invite/tuscan-gala-2025?code=EVARA-VIP"
};

const DEFAULT_NOTIFICATIONS = [
  {
    id: "ntf-1",
    category: "rsvp",
    title: "Patron Attendance Verified",
    text: "Dr. Clara Dupont confirmed attendance with +1 guest for Villa Suite 5.",
    time: "12m ago",
    unread: true
  },
  {
    id: "ntf-2",
    category: "payments",
    title: "Escrow Deposit Stamped",
    text: "₹41,666 contribution received from Julian Sterling via ICICI UPI Escrow.",
    time: "45m ago",
    unread: true
  },
  {
    id: "ntf-3",
    category: "contracts",
    title: "Artisan Contract Finalized",
    text: "Chef Fabrizio Rossi countersigned the courtyard banqueting rider.",
    time: "2h ago",
    unread: false
  },
  {
    id: "ntf-4",
    category: "general",
    title: "Checklist Milestone Approaching",
    text: "Chianti Classico tasting sample due for review tomorrow at 11:00 AM.",
    time: "4h ago",
    unread: false
  }
];

// 4. Memory & Local Cache (for zero-latency UI rendering and offline resilience)
const MemoryCache = {
  user: { ...DEFAULT_USER },
  events: [...DEFAULT_EVENTS],
  currentEventId: "evt-tuscan-gala-2025",
  guests: [...DEFAULT_GUESTS],
  expenses: [...DEFAULT_EXPENSES],
  checklist: [...DEFAULT_CHECKLIST],
  vendors: [...DEFAULT_VENDORS],
  vendorSelections: new Set(["vnd-1", "vnd-2"]),
  shopping: [...DEFAULT_SHOPPING],
  invitation: { ...DEFAULT_INVITATION },
  notifications: [...DEFAULT_NOTIFICATIONS]
};

// 5. The Core Storage & Firestore Controller
const Storage = {
  _readyPromise: null,
  _listeners: new Map(),

  // Authenticated identity validation (enforces rule: never trust arbitrary browser IDs)
  getUid() {
    const user = window.auth?.currentUser;
    if (user && user.uid) {
      return user.uid;
    }
    const localUser = this.get(STORAGE_KEYS.USER);
    if (localUser && (localUser.uid || localUser.id)) {
      return localUser.uid || localUser.id;
    }
    // Fallback sovereign demo identity ensuring uninterrupted UX even if auth is offline
    return DEFAULT_USER.uid;
  },

  requireUid() {
    const uid = this.getUid();
    return uid || DEFAULT_USER.uid;
  },

  getDb() {
    return window.db || (typeof firebase !== 'undefined' ? firebase.firestore() : null);
  },

  // Subscribe to changes for real-time reactivity
  subscribe(key, callback) {
    if (!this._listeners.has(key)) {
      this._listeners.set(key, new Set());
    }
    this._listeners.get(key).add(callback);
    return () => this._listeners.get(key).delete(callback);
  },

  _notify(key, data) {
    if (this._listeners.has(key)) {
      this._listeners.get(key).forEach(cb => {
        try { cb(data); } catch (e) { console.error('Storage notify error', e); }
      });
    }
  },

  // Synchronous getter from fast memory cache
  get(key, fallback = null) {
    if (key === STORAGE_KEYS.USER) return MemoryCache.user || fallback;
    if (key === STORAGE_KEYS.EVENTS) return MemoryCache.events || fallback;
    if (key === STORAGE_KEYS.CURRENT_EVENT_ID) return MemoryCache.currentEventId || fallback;
    if (key === STORAGE_KEYS.GUESTS) return MemoryCache.guests || fallback;
    if (key === STORAGE_KEYS.EXPENSES) return MemoryCache.expenses || fallback;
    if (key === STORAGE_KEYS.CHECKLIST) return MemoryCache.checklist || fallback;
    if (key === STORAGE_KEYS.VENDORS) return MemoryCache.vendors || fallback;
    if (key === STORAGE_KEYS.VENDOR_SELECTIONS) return MemoryCache.vendorSelections || fallback;
    if (key === STORAGE_KEYS.SHOPPING) return MemoryCache.shopping || fallback;
    if (key === STORAGE_KEYS.INVITATIONS) return MemoryCache.invitation || fallback;
    if (key === STORAGE_KEYS.NOTIFICATIONS) return MemoryCache.notifications || fallback;

    // Temporary session/local storage for UI preferences
    try {
      const stored = localStorage.getItem(`evara_pref_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      return fallback;
    }
  },

  // Generic setter that updates cache and persists appropriately
  set(key, value) {
    if (key === STORAGE_KEYS.USER) {
      MemoryCache.user = value;
      this.saveUserProfile(value).catch(console.warn);
    } else if (key === STORAGE_KEYS.EVENTS) {
      MemoryCache.events = value;
    } else if (key === STORAGE_KEYS.CURRENT_EVENT_ID) {
      MemoryCache.currentEventId = value;
      try { localStorage.setItem('evara_current_event_id', value); } catch (e) {}
    } else if (key === STORAGE_KEYS.GUESTS) {
      MemoryCache.guests = value;
    } else if (key === STORAGE_KEYS.EXPENSES) {
      MemoryCache.expenses = value;
    } else if (key === STORAGE_KEYS.CHECKLIST) {
      MemoryCache.checklist = value;
    } else if (key === STORAGE_KEYS.SHOPPING) {
      MemoryCache.shopping = value;
    } else if (key === STORAGE_KEYS.NOTIFICATIONS) {
      MemoryCache.notifications = value;
    } else {
      try {
        localStorage.setItem(`evara_pref_${key}`, JSON.stringify(value));
      } catch (e) {}
    }
    this._notify(key, value);
  },

  getCurrentEvent() {
    const currId = this.get(STORAGE_KEYS.CURRENT_EVENT_ID, "evt-tuscan-gala-2025");
    const events = this.get(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
    return events.find(e => e.id === currId) || events[0] || DEFAULT_EVENTS[0];
  },

  // ----------------------------------------------------
  // 6. Firestore User Initialization & Seed Synchronizer
  // ----------------------------------------------------
  async initUserSession(user) {
    if (!user || !user.uid) return;
    const db = this.getDb();
    if (!db) return;

    const uid = user.uid;

    try {
      // Check if user record exists in Firestore
      const userRef = db.collection(COLLECTIONS.USERS).doc(uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        // First-time user sign in: Seed default profile, events, budget, etc.
        const batch = db.batch();

        // 1. User document
        batch.set(userRef, {
          uid: uid,
          email: user.email || DEFAULT_USER.email,
          displayName: user.displayName || DEFAULT_USER.name,
          role: "Principal Host",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 2. User profile document
        const profileRef = db.collection(COLLECTIONS.USER_PROFILES).doc(uid);
        batch.set(profileRef, {
          userId: uid,
          fullName: user.displayName || DEFAULT_USER.name,
          title: DEFAULT_USER.title,
          email: user.email || DEFAULT_USER.email,
          phone: DEFAULT_USER.phone,
          avatar: DEFAULT_USER.avatar,
          kycStatus: "Verified",
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 3. Initial Curated Events
        DEFAULT_EVENTS.forEach(evt => {
          const evtRef = db.collection(COLLECTIONS.EVENTS).doc(evt.id);
          batch.set(evtRef, {
            ...evt,
            ownerId: uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });

          // Participant record
          const partRef = db.collection(COLLECTIONS.EVENT_PARTICIPANTS).doc(`${evt.id}_${uid}`);
          batch.set(partRef, {
            eventId: evt.id,
            userId: uid,
            email: user.email || DEFAULT_USER.email,
            name: user.displayName || DEFAULT_USER.name,
            role: "Principal Host",
            status: "Active",
            ownerId: uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        });

        // 4. Initial Budget Document for Tuscan Gala
        const budgetRef = db.collection(COLLECTIONS.BUDGETS).doc("evt-tuscan-gala-2025");
        batch.set(budgetRef, {
          eventId: "evt-tuscan-gala-2025",
          ownerId: uid,
          targetBudget: 1500000,
          currency: "INR",
          totalDisbursed: 775000,
          pendingEscrow: 270000,
          liquidReserve: 455000,
          headroomPercent: 30.3,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 5. Initial Guest Registrations & Contributions
        DEFAULT_GUESTS.forEach(g => {
          const gRef = db.collection(COLLECTIONS.GUEST_REGISTRATIONS).doc(g.id);
          batch.set(gRef, {
            ...g,
            eventId: "evt-tuscan-gala-2025",
            ownerId: uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });

          const cRef = db.collection(COLLECTIONS.GUEST_CONTRIBUTIONS).doc(`cnt-${g.id}`);
          batch.set(cRef, {
            id: `cnt-${g.id}`,
            eventId: "evt-tuscan-gala-2025",
            guestId: g.id,
            ownerId: uid,
            guestName: g.name,
            amount: g.contribution,
            paymentStatus: g.paymentStatus,
            method: "UPI QR Escrow",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        });

        // 6. Initial Expenses
        DEFAULT_EXPENSES.forEach(exp => {
          const expRef = db.collection(COLLECTIONS.EXPENSES).doc(exp.id);
          batch.set(expRef, {
            ...exp,
            eventId: "evt-tuscan-gala-2025",
            ownerId: uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        });

        // 7. Initial Checklist Tasks
        DEFAULT_CHECKLIST.forEach(tsk => {
          const tskRef = db.collection(COLLECTIONS.CHECKLIST_TASKS).doc(tsk.id);
          batch.set(tskRef, {
            ...tsk,
            eventId: "evt-tuscan-gala-2025",
            ownerId: uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        });

        // 8. Vendor Selections
        ["vnd-1", "vnd-2"].forEach(vId => {
          const selRef = db.collection(COLLECTIONS.VENDOR_SELECTIONS).doc(`evt-tuscan-gala-2025_${vId}`);
          batch.set(selRef, {
            eventId: "evt-tuscan-gala-2025",
            ownerId: uid,
            vendorId: vId,
            shortlisted: true,
            status: "Booked & Escrowed",
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        });

        // 9. Shopping Items
        DEFAULT_SHOPPING.forEach(item => {
          const shpRef = db.collection(COLLECTIONS.SHOPPING_LISTS).doc(item.id);
          batch.set(shpRef, {
            ...item,
            eventId: "evt-tuscan-gala-2025",
            ownerId: uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        });

        // 10. Invitation Record
        const invRef = db.collection(COLLECTIONS.INVITATIONS).doc("evt-tuscan-gala-2025");
        batch.set(invRef, {
          ...DEFAULT_INVITATION,
          eventId: "evt-tuscan-gala-2025",
          ownerId: uid,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 11. Notifications
        DEFAULT_NOTIFICATIONS.forEach(ntf => {
          const ntfRef = db.collection(COLLECTIONS.NOTIFICATIONS).doc(ntf.id);
          batch.set(ntfRef, {
            ...ntf,
            userId: uid,
            eventId: "evt-tuscan-gala-2025",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        });

        await batch.commit();
        console.log('[EVARA Storage] Successfully initialized Firestore seed data for UID:', uid);
      }

      // Fetch active user data from Firestore into memory cache
      await this.syncFromFirestore(uid);

    } catch (err) {
      console.warn('[EVARA Storage] Firestore sync warning:', err);
    }
  },

  async syncFromFirestore(uid) {
    const db = this.getDb();
    if (!db || !uid) return;

    try {
      // 1. Fetch user profile
      const profSnap = await db.collection(COLLECTIONS.USER_PROFILES).doc(uid).get();
      if (profSnap.exists) {
        MemoryCache.user = profSnap.data();
      }

      // 2. Fetch events
      const eventsSnap = await db.collection(COLLECTIONS.EVENTS).where('ownerId', '==', uid).get();
      if (!eventsSnap.empty) {
        MemoryCache.events = eventsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      }

      const currId = MemoryCache.currentEventId || "evt-tuscan-gala-2025";

      // 3. Fetch guests for current event
      const guestsSnap = await db.collection(COLLECTIONS.GUEST_REGISTRATIONS)
        .where('ownerId', '==', uid)
        .where('eventId', '==', currId)
        .get();
      if (!guestsSnap.empty) {
        MemoryCache.guests = guestsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      }

      // 4. Fetch expenses for current event
      const expSnap = await db.collection(COLLECTIONS.EXPENSES)
        .where('ownerId', '==', uid)
        .where('eventId', '==', currId)
        .get();
      if (!expSnap.empty) {
        MemoryCache.expenses = expSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      }

      // 5. Fetch checklist tasks
      const tskSnap = await db.collection(COLLECTIONS.CHECKLIST_TASKS)
        .where('ownerId', '==', uid)
        .where('eventId', '==', currId)
        .get();
      if (!tskSnap.empty) {
        MemoryCache.checklist = tskSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      }

      // 6. Fetch shopping items
      const shpSnap = await db.collection(COLLECTIONS.SHOPPING_LISTS)
        .where('ownerId', '==', uid)
        .where('eventId', '==', currId)
        .get();
      if (!shpSnap.empty) {
        MemoryCache.shopping = shpSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      }

      // 7. Fetch notifications
      const ntfSnap = await db.collection(COLLECTIONS.NOTIFICATIONS)
        .where('userId', '==', uid)
        .get();
      if (!ntfSnap.empty) {
        MemoryCache.notifications = ntfSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      }

      // 8. Fetch vendor selections
      const vselSnap = await db.collection(COLLECTIONS.VENDOR_SELECTIONS)
        .where('ownerId', '==', uid)
        .where('eventId', '==', currId)
        .get();
      if (!vselSnap.empty) {
        MemoryCache.vendorSelections = new Set(
          vselSnap.docs.filter(d => d.data().shortlisted).map(d => d.data().vendorId)
        );
      }

      // Notify UI controllers to re-render with real Firestore data
      this._notify(STORAGE_KEYS.EVENTS, MemoryCache.events);
      this._notify(STORAGE_KEYS.GUESTS, MemoryCache.guests);
      this._notify(STORAGE_KEYS.EXPENSES, MemoryCache.expenses);
      this._notify(STORAGE_KEYS.CHECKLIST, MemoryCache.checklist);
      this._notify(STORAGE_KEYS.SHOPPING, MemoryCache.shopping);
      this._notify(STORAGE_KEYS.NOTIFICATIONS, MemoryCache.notifications);

    } catch (err) {
      console.warn('[EVARA Storage] Sync warning:', err);
    }
  },

  // ----------------------------------------------------
  // 7. Events API: Save & Fetch Events
  // ----------------------------------------------------
  async getEvents() {
    const uid = this.getUid();
    if (!uid) return MemoryCache.events;
    const db = this.getDb();
    if (!db) return MemoryCache.events;

    try {
      const snap = await db.collection(COLLECTIONS.EVENTS).where('ownerId', '==', uid).get();
      if (!snap.empty) {
        MemoryCache.events = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Error fetching events from Firestore:', e);
    }
    return MemoryCache.events;
  },

  async createEvent(eventData) {
    const uid = this.requireUid();
    const db = this.getDb();
    const eventId = 'evt-' + Date.now();

    const newEvent = {
      id: eventId,
      ownerId: uid,
      title: eventData.title || "Untitled Celebration",
      archetype: eventData.archetype || "Bespoke Gathering",
      dates: eventData.dates || "Dates Pending",
      startDate: eventData.startDate || "",
      endDate: eventData.endDate || "",
      location: eventData.venue || eventData.location || "Location Private",
      venue: eventData.venue || eventData.location || "Location Private",
      targetBudget: Number(eventData.budget || eventData.targetBudget || 1500000),
      guestCount: Number(eventData.guestCount || 36),
      capacity: Number(eventData.capacity || 45),
      status: "Planning Active",
      readiness: "25% Initiated",
      coverImage: eventData.coverImage || DEFAULT_EVENTS[0].coverImage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Update memory cache immediately
    MemoryCache.events.unshift(newEvent);
    MemoryCache.currentEventId = eventId;
    this._notify(STORAGE_KEYS.EVENTS, MemoryCache.events);
    this._notify(STORAGE_KEYS.CURRENT_EVENT_ID, eventId);

    if (db) {
      try {
        const batch = db.batch();
        // 1. Create Event document
        batch.set(db.collection(COLLECTIONS.EVENTS).doc(eventId), newEvent);

        // 2. Create Participant record
        batch.set(db.collection(COLLECTIONS.EVENT_PARTICIPANTS).doc(`${eventId}_${uid}`), {
          eventId: eventId,
          userId: uid,
          email: MemoryCache.user.email,
          name: MemoryCache.user.name,
          role: "Principal Host",
          status: "Active",
          ownerId: uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 3. Create initial Budget document
        batch.set(db.collection(COLLECTIONS.BUDGETS).doc(eventId), {
          eventId: eventId,
          ownerId: uid,
          targetBudget: newEvent.targetBudget,
          currency: "INR",
          totalDisbursed: 0,
          pendingEscrow: 0,
          liquidReserve: newEvent.targetBudget,
          headroomPercent: 100,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 4. Create initial Invitation document
        batch.set(db.collection(COLLECTIONS.INVITATIONS).doc(eventId), {
          id: `inv-${eventId}`,
          eventId: eventId,
          ownerId: uid,
          title: newEvent.title,
          hosts: MemoryCache.user.name,
          dates: newEvent.dates,
          venue: newEvent.venue,
          message: "Request the pleasure of your company for our bespoke celebration.",
          theme: "champagne",
          vipLink: `${window.location.origin}/pages/invitations.html?event=${eventId}`,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 5. Add notification
        const notifId = 'ntf-' + Date.now();
        batch.set(db.collection(COLLECTIONS.NOTIFICATIONS).doc(notifId), {
          id: notifId,
          userId: uid,
          eventId: eventId,
          category: "general",
          title: "New Celebration Created",
          text: `"${newEvent.title}" has been vaulted and initialized in EVARA Concierge.`,
          time: "Just now",
          unread: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await batch.commit();
      } catch (err) {
        console.error('Error saving new event to Firestore:', err);
      }
    }

    return newEvent;
  },

  // ----------------------------------------------------
  // 8. Guests API: Save & Update Guest Information
  // ----------------------------------------------------
  async getGuests(eventId) {
    const currId = eventId || this.getCurrentEvent().id;
    const uid = this.getUid();
    if (!uid) return MemoryCache.guests;
    const db = this.getDb();
    if (!db) return MemoryCache.guests;

    try {
      const snap = await db.collection(COLLECTIONS.GUEST_REGISTRATIONS)
        .where('ownerId', '==', uid)
        .where('eventId', '==', currId)
        .get();
      if (!snap.empty) {
        MemoryCache.guests = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Error fetching guests:', e);
    }
    return MemoryCache.guests;
  },

  async saveGuest(guestData) {
    const uid = this.requireUid();
    const currEvent = this.getCurrentEvent();
    const eventId = guestData.eventId || currEvent.id;
    const db = this.getDb();

    const guestId = guestData.id || 'gst-' + Date.now();
    const paxCount = Number(guestData.pax || 1);
    const contributionAmount = Number(guestData.contribution || (41666 * paxCount));

    const newGuest = {
      id: guestId,
      eventId: eventId,
      ownerId: uid,
      name: guestData.name || "Unnamed Patron",
      email: guestData.email || "",
      phone: guestData.phone || "",
      pax: paxCount,
      plusOnes: Number(guestData.plusOnes || 0),
      rsvp: guestData.rsvp || "Confirmed",
      table: guestData.table || guestData.suite || "Unassigned",
      suite: guestData.suite || guestData.table || "Unassigned",
      dietary: guestData.dietary || "None",
      contribution: contributionAmount,
      paymentStatus: guestData.paymentStatus || "Pending Escrow",
      checkedIn: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Optimistic cache update
    const idx = MemoryCache.guests.findIndex(g => g.id === guestId);
    if (idx >= 0) {
      MemoryCache.guests[idx] = { ...MemoryCache.guests[idx], ...newGuest };
    } else {
      MemoryCache.guests.unshift(newGuest);
    }
    this._notify(STORAGE_KEYS.GUESTS, MemoryCache.guests);

    if (db) {
      try {
        const batch = db.batch();
        batch.set(db.collection(COLLECTIONS.GUEST_REGISTRATIONS).doc(guestId), newGuest);

        // Also update / create guest contribution
        const contribRef = db.collection(COLLECTIONS.GUEST_CONTRIBUTIONS).doc(`cnt-${guestId}`);
        batch.set(contribRef, {
          id: `cnt-${guestId}`,
          eventId: eventId,
          guestId: guestId,
          ownerId: uid,
          guestName: newGuest.name,
          amount: contributionAmount,
          paymentStatus: newGuest.paymentStatus,
          method: "UPI QR Escrow",
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Add activity notification
        const notifId = 'ntf-' + Date.now();
        batch.set(db.collection(COLLECTIONS.NOTIFICATIONS).doc(notifId), {
          id: notifId,
          userId: uid,
          eventId: eventId,
          category: "rsvp",
          title: "Guest Registration Stamped",
          text: `${newGuest.name} (${newGuest.pax} Pax) added to attendee roster for ${currEvent.title}.`,
          time: "Just now",
          unread: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await batch.commit();
      } catch (err) {
        console.error('Error saving guest to Firestore:', err);
      }
    }

    return newGuest;
  },

  async updateGuest(guestId, updates) {
    const uid = this.requireUid();
    const db = this.getDb();

    const idx = MemoryCache.guests.findIndex(g => g.id === guestId);
    if (idx >= 0) {
      MemoryCache.guests[idx] = { ...MemoryCache.guests[idx], ...updates };
      this._notify(STORAGE_KEYS.GUESTS, MemoryCache.guests);
    }

    if (db) {
      try {
        await db.collection(COLLECTIONS.GUEST_REGISTRATIONS).doc(guestId).update({
          ...updates,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // If paymentStatus was updated, also update contributions
        if (updates.paymentStatus) {
          await db.collection(COLLECTIONS.GUEST_CONTRIBUTIONS).doc(`cnt-${guestId}`).update({
            paymentStatus: updates.paymentStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
      } catch (err) {
        console.error('Error updating guest in Firestore:', err);
      }
    }
  },

  async deleteGuest(guestId) {
    const uid = this.requireUid();
    const db = this.getDb();

    MemoryCache.guests = MemoryCache.guests.filter(g => g.id !== guestId);
    this._notify(STORAGE_KEYS.GUESTS, MemoryCache.guests);

    if (db) {
      try {
        const batch = db.batch();
        batch.delete(db.collection(COLLECTIONS.GUEST_REGISTRATIONS).doc(guestId));
        batch.delete(db.collection(COLLECTIONS.GUEST_CONTRIBUTIONS).doc(`cnt-${guestId}`));
        await batch.commit();
      } catch (err) {
        console.error('Error deleting guest from Firestore:', err);
      }
    }
  },

  // ----------------------------------------------------
  // 9. Budget & Expenses API: Consistency & Ledger
  // ----------------------------------------------------
  async getExpenses(eventId) {
    const currId = eventId || this.getCurrentEvent().id;
    const uid = this.getUid();
    if (!uid) return MemoryCache.expenses;
    const db = this.getDb();
    if (!db) return MemoryCache.expenses;

    try {
      const snap = await db.collection(COLLECTIONS.EXPENSES)
        .where('ownerId', '==', uid)
        .where('eventId', '==', currId)
        .get();
      if (!snap.empty) {
        MemoryCache.expenses = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Error fetching expenses:', e);
    }
    return MemoryCache.expenses;
  },

  async addExpense(expenseData) {
    const uid = this.requireUid();
    const currEvent = this.getCurrentEvent();
    const eventId = expenseData.eventId || currEvent.id;
    const db = this.getDb();
    const expId = expenseData.id || 'exp-' + Date.now();

    const newExp = {
      id: expId,
      eventId: eventId,
      ownerId: uid,
      title: expenseData.title,
      category: expenseData.category || "General",
      amount: Number(expenseData.amount || 0),
      payee: expenseData.payee || "Vendor Escrow",
      status: expenseData.status || "Escrow Locked",
      date: expenseData.date || new Date().toISOString().split('T')[0],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    MemoryCache.expenses.unshift(newExp);
    this._notify(STORAGE_KEYS.EXPENSES, MemoryCache.expenses);

    // Maintain multi-module consistency: Reconcile master budget
    await this.reconcileBudget(eventId);

    if (db) {
      try {
        await db.collection(COLLECTIONS.EXPENSES).doc(expId).set(newExp);

        // Add activity notification
        const notifId = 'ntf-' + Date.now();
        await db.collection(COLLECTIONS.NOTIFICATIONS).doc(notifId).set({
          id: notifId,
          userId: uid,
          eventId: eventId,
          category: "payments",
          title: "Expense Ledger Stamped",
          text: `Recorded ₹${newExp.amount.toLocaleString('en-IN')} for "${newExp.title}" (${newExp.status}).`,
          time: "Just now",
          unread: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      } catch (err) {
        console.error('Error adding expense to Firestore:', err);
      }
    }

    return newExp;
  },

  async deleteExpense(expenseId) {
    const uid = this.requireUid();
    const currEvent = this.getCurrentEvent();
    const db = this.getDb();

    MemoryCache.expenses = MemoryCache.expenses.filter(e => e.id !== expenseId);
    this._notify(STORAGE_KEYS.EXPENSES, MemoryCache.expenses);

    await this.reconcileBudget(currEvent.id);

    if (db) {
      try {
        await db.collection(COLLECTIONS.EXPENSES).doc(expenseId).delete();
      } catch (err) {
        console.error('Error deleting expense from Firestore:', err);
      }
    }
  },

  async reconcileBudget(eventId) {
    const currEvent = this.getCurrentEvent();
    const targetBudget = currEvent.targetBudget || 1500000;
    const expenses = MemoryCache.expenses;

    const totalDisbursed = expenses
      .filter(e => e.status === 'Paid' || e.status === 'Remitted')
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

    const pendingEscrow = expenses
      .filter(e => e.status === 'Pending Escrow' || e.status === 'Escrow Locked' || e.status === 'Under Review')
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

    const liquidReserve = Math.max(0, targetBudget - totalDisbursed - pendingEscrow);
    const headroomPercent = targetBudget > 0 ? Number(((liquidReserve / targetBudget) * 100).toFixed(1)) : 0;

    const budgetData = {
      eventId: eventId,
      targetBudget,
      currency: "INR",
      totalDisbursed,
      pendingEscrow,
      liquidReserve,
      headroomPercent,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    const uid = this.getUid();
    const db = this.getDb();
    if (db && uid) {
      try {
        await db.collection(COLLECTIONS.BUDGETS).doc(eventId).set({
          ...budgetData,
          ownerId: uid
        }, { merge: true });
      } catch (e) {
        console.warn('Budget reconciliation write error:', e);
      }
    }
    return budgetData;
  },

  // ----------------------------------------------------
  // 10. Checklist Tasks API: Save Progress
  // ----------------------------------------------------
  async getChecklist(eventId) {
    const currId = eventId || this.getCurrentEvent().id;
    const uid = this.getUid();
    if (!uid) return MemoryCache.checklist;
    const db = this.getDb();
    if (!db) return MemoryCache.checklist;

    try {
      const snap = await db.collection(COLLECTIONS.CHECKLIST_TASKS)
        .where('ownerId', '==', uid)
        .where('eventId', '==', currId)
        .get();
      if (!snap.empty) {
        MemoryCache.checklist = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Error fetching checklist from Firestore:', e);
    }
    return MemoryCache.checklist;
  },

  async toggleChecklistTask(taskId, completed) {
    const uid = this.requireUid();
    const db = this.getDb();
    const currEvent = this.getCurrentEvent();

    const idx = MemoryCache.checklist.findIndex(t => t.id === taskId);
    if (idx >= 0) {
      MemoryCache.checklist[idx].completed = completed;
      this._notify(STORAGE_KEYS.CHECKLIST, MemoryCache.checklist);
    }

    // Recalculate event readiness score
    const total = MemoryCache.checklist.length;
    const done = MemoryCache.checklist.filter(t => t.completed).length;
    const readinessPct = total > 0 ? Math.round((done / total) * 100) : 50;
    const readinessStr = `${readinessPct}% Calibrated`;

    currEvent.readiness = readinessStr;
    this._notify(STORAGE_KEYS.EVENTS, MemoryCache.events);

    if (db) {
      try {
        const batch = db.batch();
        batch.update(db.collection(COLLECTIONS.CHECKLIST_TASKS).doc(taskId), {
          completed: completed,
          completedAt: completed ? firebase.firestore.FieldValue.serverTimestamp() : null
        });
        batch.update(db.collection(COLLECTIONS.EVENTS).doc(currEvent.id), {
          readiness: readinessStr,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        await batch.commit();
      } catch (err) {
        console.error('Error toggling checklist task in Firestore:', err);
      }
    }
  },

  // ----------------------------------------------------
  // 11. Vendor Selections API: Save Selections
  // ----------------------------------------------------
  async toggleVendorShortlist(vendorId, isShortlisted) {
    const uid = this.requireUid();
    const currEvent = this.getCurrentEvent();
    const db = this.getDb();

    if (isShortlisted) {
      MemoryCache.vendorSelections.add(vendorId);
    } else {
      MemoryCache.vendorSelections.delete(vendorId);
    }
    this._notify(STORAGE_KEYS.VENDOR_SELECTIONS, MemoryCache.vendorSelections);

    if (db) {
      try {
        const docId = `${currEvent.id}_${vendorId}`;
        await db.collection(COLLECTIONS.VENDOR_SELECTIONS).doc(docId).set({
          eventId: currEvent.id,
          ownerId: uid,
          vendorId: vendorId,
          shortlisted: isShortlisted,
          status: isShortlisted ? "Shortlisted" : "Exploring",
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error('Error updating vendor selection in Firestore:', err);
      }
    }
  },

  async saveVendorRfp(vendorName, rfpData) {
    const uid = this.requireUid();
    const currEvent = this.getCurrentEvent();
    const db = this.getDb();

    if (db) {
      try {
        const rfpId = 'rfp-' + Date.now();
        await db.collection(COLLECTIONS.VENDOR_SELECTIONS).doc(`${currEvent.id}_rfp_${rfpId}`).set({
          eventId: currEvent.id,
          ownerId: uid,
          vendorName: vendorName,
          status: "RFP Dispatched",
          dates: rfpData.dates || currEvent.dates,
          headcount: rfpData.headcount || currEvent.guestCount,
          notes: rfpData.notes || "",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Add notification
        const notifId = 'ntf-' + Date.now();
        await db.collection(COLLECTIONS.NOTIFICATIONS).doc(notifId).set({
          id: notifId,
          userId: uid,
          eventId: currEvent.id,
          category: "contracts",
          title: "Artisan RFP Dispatched",
          text: `Formal RFP dispatched to ${vendorName} for ${currEvent.title}.`,
          time: "Just now",
          unread: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      } catch (err) {
        console.error('Error saving vendor RFP in Firestore:', err);
      }
    }
  },

  // ----------------------------------------------------
  // 12. Shopping Lists API: Save & Procure
  // ----------------------------------------------------
  async getShoppingList(eventId) {
    const currId = eventId || this.getCurrentEvent().id;
    const uid = this.getUid();
    if (!uid) return MemoryCache.shopping;
    const db = this.getDb();
    if (!db) return MemoryCache.shopping;

    try {
      const snap = await db.collection(COLLECTIONS.SHOPPING_LISTS)
        .where('ownerId', '==', uid)
        .where('eventId', '==', currId)
        .get();
      if (!snap.empty) {
        MemoryCache.shopping = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Error fetching shopping list:', e);
    }
    return MemoryCache.shopping;
  },

  async addShoppingItem(itemData) {
    const uid = this.requireUid();
    const currEvent = this.getCurrentEvent();
    const db = this.getDb();
    const itemId = itemData.id || 'shp-' + Date.now();

    const newItem = {
      id: itemId,
      eventId: currEvent.id,
      ownerId: uid,
      name: itemData.name || "Bespoke Procurement Item",
      category: itemData.category || "General",
      merchant: itemData.merchant || "Artisan Direct",
      price: Number(itemData.price || 0),
      qty: Number(itemData.qty || 1),
      purchased: Boolean(itemData.purchased),
      assignedTo: itemData.assignedTo || MemoryCache.user.name,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    MemoryCache.shopping.unshift(newItem);
    this._notify(STORAGE_KEYS.SHOPPING, MemoryCache.shopping);

    if (db) {
      try {
        await db.collection(COLLECTIONS.SHOPPING_LISTS).doc(itemId).set(newItem);
      } catch (err) {
        console.error('Error adding shopping item to Firestore:', err);
      }
    }

    return newItem;
  },

  async toggleShoppingItem(itemId, purchased) {
    const uid = this.requireUid();
    const db = this.getDb();

    const idx = MemoryCache.shopping.findIndex(i => i.id === itemId);
    if (idx >= 0) {
      MemoryCache.shopping[idx].purchased = purchased;
      this._notify(STORAGE_KEYS.SHOPPING, MemoryCache.shopping);
    }

    if (db) {
      try {
        await db.collection(COLLECTIONS.SHOPPING_LISTS).doc(itemId).update({
          purchased: purchased,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      } catch (err) {
        console.error('Error toggling shopping item in Firestore:', err);
      }
    }
  },

  async deleteShoppingItem(itemId) {
    const uid = this.requireUid();
    const db = this.getDb();

    MemoryCache.shopping = MemoryCache.shopping.filter(i => i.id !== itemId);
    this._notify(STORAGE_KEYS.SHOPPING, MemoryCache.shopping);

    if (db) {
      try {
        await db.collection(COLLECTIONS.SHOPPING_LISTS).doc(itemId).delete();
      } catch (err) {
        console.error('Error deleting shopping item from Firestore:', err);
      }
    }
  },

  // ----------------------------------------------------
  // 13. Invitations API: Save & Preview
  // ----------------------------------------------------
  async getInvitation(eventId) {
    const currId = eventId || this.getCurrentEvent().id;
    const uid = this.getUid();
    if (!uid) return MemoryCache.invitation;
    const db = this.getDb();
    if (!db) return MemoryCache.invitation;

    try {
      const snap = await db.collection(COLLECTIONS.INVITATIONS).doc(currId).get();
      if (snap.exists) {
        MemoryCache.invitation = { id: snap.id, ...snap.data() };
      }
    } catch (e) {
      console.warn('Error fetching invitation:', e);
    }
    return MemoryCache.invitation;
  },

  async saveInvitation(eventId, inviteData) {
    const uid = this.requireUid();
    const currId = eventId || this.getCurrentEvent().id;
    const db = this.getDb();

    const updated = {
      ...MemoryCache.invitation,
      ...inviteData,
      eventId: currId,
      ownerId: uid,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    MemoryCache.invitation = updated;
    this._notify(STORAGE_KEYS.INVITATIONS, MemoryCache.invitation);

    if (db) {
      try {
        await db.collection(COLLECTIONS.INVITATIONS).doc(currId).set(updated, { merge: true });
      } catch (err) {
        console.error('Error saving invitation to Firestore:', err);
      }
    }

    return updated;
  },

  // ----------------------------------------------------
  // 14. Notifications API: Fetch & Mark Read
  // ----------------------------------------------------
  async getNotifications() {
    const uid = this.getUid();
    if (!uid) return MemoryCache.notifications;
    const db = this.getDb();
    if (!db) return MemoryCache.notifications;

    try {
      const snap = await db.collection(COLLECTIONS.NOTIFICATIONS)
        .where('userId', '==', uid)
        .get();
      if (!snap.empty) {
        MemoryCache.notifications = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Error fetching notifications:', e);
    }
    return MemoryCache.notifications;
  },

  async markNotificationRead(id) {
    const uid = this.requireUid();
    const db = this.getDb();

    const idx = MemoryCache.notifications.findIndex(n => n.id === id);
    if (idx >= 0) {
      MemoryCache.notifications[idx].unread = false;
      this._notify(STORAGE_KEYS.NOTIFICATIONS, MemoryCache.notifications);
    }

    if (db) {
      try {
        await db.collection(COLLECTIONS.NOTIFICATIONS).doc(id).update({
          unread: false
        });
      } catch (err) {
        console.error('Error marking notification read in Firestore:', err);
      }
    }
  },

  async markAllNotificationsRead() {
    const uid = this.requireUid();
    const db = this.getDb();

    MemoryCache.notifications.forEach(n => { n.unread = false; });
    this._notify(STORAGE_KEYS.NOTIFICATIONS, MemoryCache.notifications);

    if (db) {
      try {
        const batch = db.batch();
        const snap = await db.collection(COLLECTIONS.NOTIFICATIONS)
          .where('userId', '==', uid)
          .where('unread', '==', true)
          .get();
        snap.forEach(doc => {
          batch.update(doc.ref, { unread: false });
        });
        await batch.commit();
      } catch (err) {
        console.error('Error marking all notifications read in Firestore:', err);
      }
    }
  },

  async deleteNotification(id) {
    const uid = this.requireUid();
    const db = this.getDb();

    MemoryCache.notifications = MemoryCache.notifications.filter(n => n.id !== id);
    this._notify(STORAGE_KEYS.NOTIFICATIONS, MemoryCache.notifications);

    if (db) {
      try {
        await db.collection(COLLECTIONS.NOTIFICATIONS).doc(id).delete();
      } catch (err) {
        console.error('Error deleting notification from Firestore:', err);
      }
    }
  },

  // ----------------------------------------------------
  // 15. User Profile API
  // ----------------------------------------------------
  async saveUserProfile(profileData) {
    const uid = this.requireUid();
    const db = this.getDb();

    MemoryCache.user = { ...MemoryCache.user, ...profileData };
    this._notify(STORAGE_KEYS.USER, MemoryCache.user);

    if (db) {
      try {
        await db.collection(COLLECTIONS.USER_PROFILES).doc(uid).set({
          ...profileData,
          userId: uid,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error('Error saving user profile to Firestore:', err);
      }
    }
  }
};

// Expose globally to window
window.COLLECTIONS = COLLECTIONS;
window.STORAGE_KEYS = STORAGE_KEYS;
window.DEFAULT_USER = DEFAULT_USER;
window.DEFAULT_EVENTS = DEFAULT_EVENTS;
window.DEFAULT_GUESTS = DEFAULT_GUESTS;
window.DEFAULT_EXPENSES = DEFAULT_EXPENSES;
window.DEFAULT_CHECKLIST = DEFAULT_CHECKLIST;
window.DEFAULT_VENDORS = DEFAULT_VENDORS;
window.DEFAULT_SHOPPING = DEFAULT_SHOPPING;
window.DEFAULT_INVITATION = DEFAULT_INVITATION;
window.DEFAULT_NOTIFICATIONS = DEFAULT_NOTIFICATIONS;
window.Storage = Storage;

// Auto-initialize when auth changes
if (typeof firebase !== 'undefined' && firebase.auth) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      Storage.initUserSession(user);
    }
  });
}
