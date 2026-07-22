export const BRIBES = [
  { id: 'none', label: 'Nothing, just my presence', icon: '🤷‍♂️', probImpact: -50, funnyNote: "Warning: High risk of instant rejection." },
  { id: 'boba', label: 'Pani Puri (Teekha Paani)', icon: '😋', probImpact: 35, funnyNote: "Spicy water balls. Aditi can eat 50 in one go." },
  { id: 'coffee', label: 'Starbucks Iced Latte / Matcha Latte', icon: '☕', probImpact: 25, funnyNote: "Keeps her awake during useless meetings." },
  { id: 'pastry', label: 'Steam / Fried Momos', icon: '🥟', probImpact: 30, funnyNote: "Extra spicy red chutney is mandatory for calendar slots." },
  { id: 'cookies', label: 'Homemade Warm Choc Chip Cookies', icon: '🍪', probImpact: 45, funnyNote: "Legendary bribe. Almost guaranteed success." },
  { id: 'gossip', label: 'Fresh, juicy, hot gossip', icon: '🔥', probImpact: 50, funnyNote: "Instant approval. Calendar cleared." }
];

export const FUNNY_REJECTIONS = [
  "Bribe level insufficient. Need more sugar.",
  "Conflicts with my scheduled staring-at-the-wall time.",
  "Social battery is currently at 2%. Re-evaluate next week.",
  "I have already exceeded my weekly quota of social interactions.",
  "My cat told me not to go.",
  "I'm busy pretend-working on a very important presentation."
];

export const FUNNY_STATUSES = [
  { text: "Ignoring 47 unread Slack notifications", level: 95 },
  { text: "Pretending to listen to a Zoom meeting about meetings", level: 85 },
  { text: "Struggling with CSS alignment in Tailwind", level: 90 },
  { text: "Re-organizing her color-coded Google Calendar", level: 80 },
  { text: "Drinking her 4th coffee of the day", level: 99 },
  { text: "Staring blankly at a spreadsheet", level: 75 },
  { text: "Napping under the desk (social battery low)", level: 100 }
];

export const INITIAL_BOOKINGS = [
  {
    id: "mock-1",
    name: "The Manager",
    date: "", // Will be set to today dynamically
    time: "10:00",
    bribe: "none",
    urgency: "high",
    reason: "Urgent status sync about our alignment meeting",
    status: "approved",
    rejectionReason: ""
  },
  {
    id: "mock-2",
    name: "Sarah (Bestie)",
    date: "", // Will be set to today dynamically
    time: "14:00",
    bribe: "gossip",
    urgency: "high",
    reason: "CRITICAL GOSSIP ALERT: You will not believe what happened",
    status: "approved",
    rejectionReason: ""
  }
];
