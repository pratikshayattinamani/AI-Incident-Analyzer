// Simple localStorage-backed store + mock AI engine.
import { useEffect, useState } from "react";

export type Role = "admin" | "engineer";
export type Severity = "Critical" | "High" | "Medium" | "Low";
export type Category = "Mechanical" | "Electrical" | "Software" | "Network";
export type RiskLevel = "Critical" | "High" | "Medium" | "Low";
export type MaintenanceStatus = "Open" | "In Progress" | "Completed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Incident {
  id: string;
  machineName: string;
  description: string;
  category: Category;
  severity: Severity;
  summary: string;
  rootCauses: string[];
  immediateActions: string[];
  longTermActions: string[];
  prevention: string;
  status: "Open" | "Resolved";
  createdAt: string;
  createdBy: string;
}

export interface MaintenanceRecord {
  id: string;
  machineName: string;
  problem: string;
  technician: string;
  repairDetails: string;
  cost: number;
  date: string;
  status: MaintenanceStatus;
}

export interface Prediction {
  id: string;
  machineName: string;
  healthScore: number;
  riskLevel: RiskLevel;
  prediction: string;
  recommendation: string;
  daysUntilFailure: number;
}

// ---------- storage helpers ----------
const K = {
  session: "sentinel.session",
  users: "sentinel.users",
  incidents: "sentinel.incidents",
  maintenance: "sentinel.maintenance",
  predictions: "sentinel.predictions",
  seeded: "sentinel.seeded.v1",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("sentinel:change", { detail: key }));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ---------- session ----------
export function getSession(): User | null {
  return read<User | null>(K.session, null);
}
export function setSession(u: User | null) {
  write(K.session, u);
}

// ---------- auth ----------
interface StoredUser extends User {
  password: string;
}
export function register(name: string, email: string, password: string, role: Role): User {
  const users = read<StoredUser[]>(K.users, []);
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with that email already exists");
  }
  const user: StoredUser = {
    id: uid(),
    name,
    email,
    role,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  write(K.users, users);
  const { password: _, ...safe } = user;
  setSession(safe);
  return safe;
}

export function login(email: string, password: string): User {
  const users = read<StoredUser[]>(K.users, []);
  const found = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!found) throw new Error("Invalid email or password");
  const { password: _, ...safe } = found;
  setSession(safe);
  return safe;
}

export function logout() {
  setSession(null);
}

export function listUsers(): User[] {
  return read<StoredUser[]>(K.users, []).map(({ password, ...u }) => u);
}

// ---------- incidents ----------
export function listIncidents(): Incident[] {
  return read<Incident[]>(K.incidents, []);
}
export function addIncident(i: Incident) {
  const list = listIncidents();
  list.unshift(i);
  write(K.incidents, list);
}
export function updateIncident(id: string, patch: Partial<Incident>) {
  const list = listIncidents().map((i) => (i.id === id ? { ...i, ...patch } : i));
  write(K.incidents, list);
}
export function deleteIncident(id: string) {
  write(K.incidents, listIncidents().filter((i) => i.id !== id));
}

// ---------- maintenance ----------
export function listMaintenance(): MaintenanceRecord[] {
  return read<MaintenanceRecord[]>(K.maintenance, []);
}
export function addMaintenance(r: MaintenanceRecord) {
  const list = listMaintenance();
  list.unshift(r);
  write(K.maintenance, list);
}
export function updateMaintenance(id: string, patch: Partial<MaintenanceRecord>) {
  write(
    K.maintenance,
    listMaintenance().map((r) => (r.id === id ? { ...r, ...patch } : r))
  );
}
export function deleteMaintenance(id: string) {
  write(K.maintenance, listMaintenance().filter((r) => r.id !== id));
}

// ---------- predictions ----------
export function listPredictions(): Prediction[] {
  return read<Prediction[]>(K.predictions, []);
}

// ---------- mock AI engine ----------
interface Pattern {
  keywords: string[];
  category: Category;
  severity: Severity;
  summaryTpl: (m: string) => string;
  rootCauses: string[];
  immediateActions: string[];
  longTermActions: string[];
  prevention: string;
}

const PATTERNS: Pattern[] = [
  {
    keywords: ["overheat", "hot", "temperature", "thermal", "burning"],
    category: "Mechanical",
    severity: "Critical",
    summaryTpl: (m) =>
      `${m} halted due to a thermal excursion. Sensor data indicates temperature exceeded safe operating limits, most likely from lubrication starvation or cooling loop failure.`,
    rootCauses: [
      "Bearing friction increased due to lubricant degradation",
      "Coolant flow restriction or pump underperformance",
      "Motor temperature exceeded rated threshold",
    ],
    immediateActions: [
      "Stop machine operation and lock out power",
      "Inspect lubrication system and top up if required",
      "Verify cooling fans and coolant circulation",
    ],
    longTermActions: [
      "Schedule weekly lubrication and thermal checks",
      "Replace bearings on the affected assembly",
    ],
    prevention:
      "Install temperature sensors on high-risk assemblies and run predictive thermal analysis every 200 operating hours.",
  },
  {
    keywords: ["vibration", "vibrate", "shake", "unbalanced", "imbalance"],
    category: "Mechanical",
    severity: "High",
    summaryTpl: (m) =>
      `${m} exhibited abnormal vibration signatures indicating rotating-component wear or misalignment. Continued operation risks catastrophic failure of the assembly.`,
    rootCauses: [
      "Rotor imbalance or shaft misalignment",
      "Worn bearings amplifying operational harmonics",
      "Loose mounting bolts or foundation settling",
    ],
    immediateActions: [
      "Reduce load and shut down for inspection",
      "Perform vibration signature analysis on the drivetrain",
      "Torque-check all mounting hardware",
    ],
    longTermActions: [
      "Realign shafts using laser alignment tools",
      "Replace worn bearings and re-balance rotating assemblies",
    ],
    prevention:
      "Deploy continuous vibration monitoring with FFT analysis and set alerts at 25% above baseline harmonic amplitude.",
  },
  {
    keywords: ["voltage", "electric", "power", "current", "fuse", "short", "spark"],
    category: "Electrical",
    severity: "High",
    summaryTpl: (m) =>
      `${m} tripped due to an electrical fault. Voltage or current fluctuations were detected outside of the acceptable envelope, likely from supply instability or insulation breakdown.`,
    rootCauses: [
      "Input voltage fluctuation beyond tolerance band",
      "Insulation degradation causing intermittent shorts",
      "Overcurrent from stalled load or shorted winding",
    ],
    immediateActions: [
      "Isolate the machine from power distribution",
      "Inspect breaker panel and reset any tripped protection",
      "Test insulation resistance on motor windings (megger test)",
    ],
    longTermActions: [
      "Install voltage stabilizer or line conditioner",
      "Replace aged wiring and terminal blocks",
    ],
    prevention:
      "Add power quality logging on the incoming feed and audit electrical harnesses every quarter.",
  },
  {
    keywords: ["network", "connection", "disconnect", "offline", "timeout", "packet"],
    category: "Network",
    severity: "Medium",
    summaryTpl: (m) =>
      `${m} lost connectivity to the control network. Downtime is bounded but risks cascading into scheduling failures if not resolved.`,
    rootCauses: [
      "Switch port failure or misconfigured VLAN",
      "Cable degradation or EMI interference on the plant floor",
      "Firmware bug in industrial gateway causing dropped sessions",
    ],
    immediateActions: [
      "Verify link lights and switch port status",
      "Restart the industrial gateway / edge PLC",
      "Re-seat Ethernet connectors and check shielding",
    ],
    longTermActions: [
      "Replace suspect patch cables with shielded Cat6a",
      "Segment the plant network with redundant switches",
    ],
    prevention:
      "Enable SNMP monitoring on all industrial switches and alert on link-flap counts above 3 per hour.",
  },
  {
    keywords: ["software", "crash", "error", "exception", "hang", "freeze", "bsod"],
    category: "Software",
    severity: "Medium",
    summaryTpl: (m) =>
      `${m} experienced a software fault causing control loop interruption. Machine safety was maintained but production throughput was lost.`,
    rootCauses: [
      "Unhandled exception in PLC control routine",
      "Memory leak in HMI application after prolonged uptime",
      "Firmware/driver incompatibility after recent update",
    ],
    immediateActions: [
      "Capture crash logs and stack traces",
      "Restart the HMI / SCADA service",
      "Roll back to the previous known-good firmware if issue recurs",
    ],
    longTermActions: [
      "Deploy an updated PLC firmware with the fix backported",
      "Add automated log shipping to a central observability stack",
    ],
    prevention:
      "Adopt a staged firmware rollout process and run soak tests for 72 hours before promoting to production lines.",
  },
  {
    keywords: ["sensor", "reading", "signal", "calibration", "drift"],
    category: "Electrical",
    severity: "Medium",
    summaryTpl: (m) =>
      `${m} produced anomalous sensor readings inconsistent with process behaviour. Data quality is degraded and downstream control decisions may be unreliable.`,
    rootCauses: [
      "Sensor calibration drift beyond acceptable tolerance",
      "Signal cable damage or connector corrosion",
      "EMI from nearby high-power equipment",
    ],
    immediateActions: [
      "Cross-check readings against a reference instrument",
      "Recalibrate or replace the affected sensor",
      "Inspect signal cabling and shielding integrity",
    ],
    longTermActions: [
      "Standardise on shielded twisted-pair sensor cabling",
      "Schedule quarterly calibration cycles with traceable references",
    ],
    prevention:
      "Add redundant sensors on safety-critical measurements and use voting logic to detect drift automatically.",
  },
  {
    keywords: ["lubricat", "grease", "oil", "seized", "stuck"],
    category: "Mechanical",
    severity: "High",
    summaryTpl: (m) =>
      `${m} experienced mechanical seizure symptoms consistent with lubrication failure. Moving components are running dry and wear rates will accelerate quickly.`,
    rootCauses: [
      "Grease line blockage preventing lubricant delivery",
      "Contaminated lubricant from ingress of debris",
      "Auto-luber pump failure or empty reservoir",
    ],
    immediateActions: [
      "Halt operation and manually lubricate affected joints",
      "Flush and refill the lubrication system with fresh grease",
      "Inspect auto-luber pump and reservoir levels",
    ],
    longTermActions: [
      "Replace lubrication filters and check line integrity",
      "Add flow sensors on critical grease lines",
    ],
    prevention:
      "Install lubricant level and flow monitoring; alert operators when delivery drops below 80% of nominal.",
  },
];

const FALLBACK: Pattern = {
  keywords: [],
  category: "Mechanical",
  severity: "Medium",
  summaryTpl: (m) =>
    `${m} reported an unclassified anomaly. Preliminary analysis suggests degraded operation. A technician inspection is recommended to confirm the root cause.`,
  rootCauses: [
    "Component wear consistent with operating hours accumulated",
    "Environmental factors (dust, humidity, temperature) affecting reliability",
    "Deviation from documented operating procedures",
  ],
  immediateActions: [
    "Log the event with full context and timestamps",
    "Schedule a hands-on inspection during the next shift change",
    "Reduce operating load until inspection is complete",
  ],
  longTermActions: [
    "Add the failure mode to the FMEA register",
    "Review preventive maintenance intervals for this asset class",
  ],
  prevention:
    "Increase telemetry sampling on this asset and correlate with production KPIs to isolate the failure mode.",
};

export interface AnalysisResult {
  summary: string;
  severity: Severity;
  category: Category;
  rootCauses: string[];
  immediateActions: string[];
  longTermActions: string[];
  prevention: string;
}

export function analyzeIncident(
  machineName: string,
  description: string,
  hintCategory?: Category
): AnalysisResult {
  const text = description.toLowerCase();
  const match =
    PATTERNS.find((p) => p.keywords.some((k) => text.includes(k))) ?? FALLBACK;
  const asset = machineName || "The affected asset";
  return {
    summary: match.summaryTpl(asset),
    severity: match.severity,
    category: hintCategory ?? match.category,
    rootCauses: match.rootCauses,
    immediateActions: match.immediateActions,
    longTermActions: match.longTermActions,
    prevention: match.prevention,
  };
}

// ---------- seed sample data ----------
export function seedIfEmpty() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(K.seeded)) return;

  const now = Date.now();
  const day = 86400000;

  const incidents: Incident[] = [
    {
      id: uid(),
      machineName: "CNC Machine 04",
      description:
        "Machine stopped suddenly after 5 hours of operation. Motor temperature increased and unusual vibration detected.",
      ...analyzeIncident("CNC Machine 04", "overheating and vibration in motor"),
      status: "Open",
      createdAt: new Date(now - day).toISOString(),
      createdBy: "system",
    },
    {
      id: uid(),
      machineName: "Hydraulic Press 01",
      description: "Pressure loss during forming cycle, potential seal degradation.",
      ...analyzeIncident("Hydraulic Press 01", "hydraulic seal lubrication loss"),
      status: "Resolved",
      createdAt: new Date(now - 4 * day).toISOString(),
      createdBy: "system",
    },
    {
      id: uid(),
      machineName: "PLC Gateway B",
      description: "Intermittent network dropouts causing SCADA disconnections.",
      ...analyzeIncident("PLC Gateway B", "network disconnect timeout on switch"),
      status: "Open",
      createdAt: new Date(now - 2 * day).toISOString(),
      createdBy: "system",
    },
    {
      id: uid(),
      machineName: "HMI Station 7",
      description: "SCADA software crash after firmware update.",
      ...analyzeIncident("HMI Station 7", "software crash exception after update"),
      status: "Resolved",
      createdAt: new Date(now - 6 * day).toISOString(),
      createdBy: "system",
    },
  ];

  const maintenance: MaintenanceRecord[] = [
    {
      id: uid(),
      machineName: "CNC Machine 04",
      problem: "Bearing replacement and lubrication overhaul",
      technician: "R. Kapoor",
      repairDetails: "Replaced spindle bearings, flushed grease lines, calibrated thermal sensors.",
      cost: 1240,
      date: new Date(now - day).toISOString(),
      status: "Completed",
    },
    {
      id: uid(),
      machineName: "Hydraulic Press 01",
      problem: "Pump seal replacement",
      technician: "M. Chen",
      repairDetails: "Replaced primary hydraulic pump seals, re-pressurised system.",
      cost: 860,
      date: new Date(now - 3 * day).toISOString(),
      status: "Completed",
    },
    {
      id: uid(),
      machineName: "Conveyor Line A",
      problem: "Belt tensioner adjustment",
      technician: "S. Alvarez",
      repairDetails: "Adjusted belt tension and lubricated idler bearings.",
      cost: 220,
      date: new Date(now - 5 * day).toISOString(),
      status: "In Progress",
    },
    {
      id: uid(),
      machineName: "Robotic Arm 12",
      problem: "Routine calibration",
      technician: "J. O'Neil",
      repairDetails: "Full 6-axis calibration and end-effector re-zeroing.",
      cost: 380,
      date: new Date(now - 10 * day).toISOString(),
      status: "Open",
    },
  ];

  const predictions: Prediction[] = [
    {
      id: uid(),
      machineName: "Hydraulic Press 01",
      healthScore: 72,
      riskLevel: "Medium",
      prediction: "Possible hydraulic pump failure within 15 days",
      recommendation: "Inspect hydraulic pressure system and replace primary pump seals",
      daysUntilFailure: 15,
    },
    {
      id: uid(),
      machineName: "Conveyor Line A",
      healthScore: 38,
      riskLevel: "Critical",
      prediction: "Belt slip risk imminent — failure likely within 4 days",
      recommendation: "Immediate belt inspection and tensioner replacement",
      daysUntilFailure: 4,
    },
    {
      id: uid(),
      machineName: "CNC Machine 04",
      healthScore: 86,
      riskLevel: "Low",
      prediction: "Stable operation projected for 45+ days",
      recommendation: "Continue routine 200-hour lubrication cycle",
      daysUntilFailure: 45,
    },
    {
      id: uid(),
      machineName: "Robotic Arm 12",
      healthScore: 61,
      riskLevel: "Medium",
      prediction: "Servo motor drift detected — recalibration needed in ~12 days",
      recommendation: "Schedule 6-axis re-calibration and firmware update",
      daysUntilFailure: 12,
    },
    {
      id: uid(),
      machineName: "PLC Gateway B",
      healthScore: 54,
      riskLevel: "High",
      prediction: "Network gateway may fail within 8 days due to session instability",
      recommendation: "Replace gateway firmware and audit switch port health",
      daysUntilFailure: 8,
    },
  ];

  write(K.incidents, incidents);
  write(K.maintenance, maintenance);
  write(K.predictions, predictions);
  localStorage.setItem(K.seeded, "1");
}

// ---------- react hook ----------
export function useStore<T>(reader: () => T): T {
  const [value, setValue] = useState<T>(() => reader());
  useEffect(() => {
    const handler = () => setValue(reader());
    handler();
    window.addEventListener("sentinel:change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("sentinel:change", handler);
      window.removeEventListener("storage", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}

export const gen = { uid };
