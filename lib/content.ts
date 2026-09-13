export type Stat = {
  value: string;
  label: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type Solution = {
  slug: string;
  title: string;
  shortHeadline: string;
  fullHeadline: string;
  description: string;
  features: string[];
  image: string;
};

export type Course = {
  slug: string;
  code: string;
  badge: string;
  title: string;
  headline: string;
  description: string;
  image: string;
  whatYouLearn: string[];
  guideName: string;
  cta: string;
};

export type ProblemCard = {
  number: string;
  title: string;
  description: string;
  link: string;
};

export type Result = {
  customer: string;
  company: string;
  industry: string;
  problem: string;
  solution: string;
  result: string;
  image: string;
};

export type Package = {
  name: string;
  tagline: string;
  features: string[];
  cta: string;
  href: string;
};

export const site = {
  name: "Wazambi GPS",
  logo: "/images/wazambi-logo-light-v2.svg",
  announcement: {
    badge: "NEW",
    text: "WAZAMBI GPS AGENT PROGRAM NOW OPEN — ONLY 100 AGENTS WILL BE SELECTED",
    link: "/agents",
  },
  video: {
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster: "/images/media/video-poster.jpg",
  },
  whatsapp: {
    number: "260000000000",
    message:
      "Hello Wazambi GPS. I would like help choosing the right solution for my vehicles.",
  },
};

export type NavLink = { label: string; href: string; parent?: string };

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Customer Results", href: "/customer-results" },
  { label: "Fleet Academy", href: "/academy" },
  { label: "Become an Agent", href: "/agents" },
  { label: "Contact Us", href: "/contact" },
];

export const mobileNav: NavLink[] = [
  ...navLinks,
  { label: "GPS Tracking", href: "/gps-tracking", parent: "Solutions" },
  { label: "Fuel Monitoring", href: "/fuel-monitoring", parent: "Solutions" },
  { label: "Fleet Management", href: "/fleet-management", parent: "Solutions" },
  { label: "GPS Tracking Course", href: "/academy/gps-tracking", parent: "Fleet Academy" },
  { label: "Fuel Monitoring Course", href: "/academy/fuel-monitoring", parent: "Fleet Academy" },
  { label: "Fleet Management Course", href: "/academy/fleet-management", parent: "Fleet Academy" },
];

export const hero = {
  eyebrow: "Real-Time Vehicle and Fleet Control",
  headline: "Do You Know What Your Vehicles Are Doing Right Now?",
  subline:
    "Track every vehicle live, control fuel misuse, monitor drivers and manage your fleet—all from your phone.",
  primaryCta: { label: "Get a Free Fleet Assessment", href: "/fleet-assessment" },
  secondaryCta: { label: "View Our Solutions", href: "#solutions" },
  imageLeft: "/images/hero/left-fleet.jpg",
  imageRight: "/images/hero/right-app.jpg",
  imageMobile: "/images/hero/mobile-banner.jpg",
};

export const stats: Stat[] = [
  { value: "8,000+", label: "Vehicles Monitored" },
  { value: "500+", label: "Fleet Customers Served" },
  { value: "10,000+", label: "Installations Completed" },
  { value: "10+", label: "Years of Experience" },
];

export const problems: ProblemCard[] = [
  {
    number: "01",
    title: "Losing Control of Vehicles",
    description:
      "When vehicle information depends on calls and driver explanations, management is always reacting late.",
    link: "/gps-tracking",
  },
  {
    number: "02",
    title: "Losing Money Through Fuel",
    description:
      "Unexplained fuel drops, false refuelling and poor fuel control can quietly reduce fleet profits.",
    link: "/fuel-monitoring",
  },
  {
    number: "03",
    title: "Losing Time Through Poor Management",
    description:
      "Unauthorised trips, missed maintenance and scattered records make fleets more expensive to operate.",
    link: "/fleet-management",
  },
];

export const solutions: Solution[] = [
  {
    slug: "gps-tracking",
    title: "GPS Tracking",
    shortHeadline: "Monitor live location, routes, trip history, ignition status, speeding and important vehicle alerts.",
    fullHeadline: "Know Where Every Vehicle Is—Without Calling the Driver.",
    description:
      "See exactly where your vehicles are, where they have been and what is happening right now — without relying on phone calls or driver explanations.",
    features: [
      "Live location",
      "Route playback",
      "Trip history",
      "Geofences",
      "Ignition status",
      "Speeding alerts",
      "Remote immobilisation",
      "Local and cross-border tracking",
    ],
    image: "/images/solutions/gps.jpg",
  },
  {
    slug: "fuel-monitoring",
    title: "Fuel Monitoring",
    shortHeadline: "Monitor fuel levels, refuelling, consumption and suspicious fuel drops.",
    fullHeadline: "Control Fuel With Records—Not Driver Explanations.",
    description:
      "Know every litre. Monitor fuel levels, refuelling events and consumption with records that cannot be argued with.",
    features: [
      "Fuel-level monitoring",
      "Refuelling records",
      "Suspicious fuel-drop alerts",
      "Fuel-consumption reports",
      "Vehicle comparisons",
      "Fuel investigation records",
    ],
    image: "/images/solutions/fuel.jpg",
  },
  {
    slug: "fleet-management",
    title: "Fleet Management",
    shortHeadline: "Organise vehicles and drivers, manage maintenance, monitor performance and use reports to make better decisions.",
    fullHeadline: "Bring Your Vehicles, Drivers, Fuel and Reports Into One System.",
    description:
      "One platform for your whole operation: vehicles, drivers, fuel, maintenance and reporting — so you decide with facts, not guesswork.",
    features: [
      "Vehicle management",
      "Driver management",
      "Unauthorised-trip monitoring",
      "Maintenance scheduling",
      "Driver behaviour",
      "Fleet reports",
      "Local and cross-border management",
    ],
    image: "/images/solutions/fleet.jpg",
  },
];

export const howItWorks = [
  {
    title: "Tell Us About Your Vehicles",
    text: "The customer tells Wazambi about their vehicles and how they operate.",
  },
  {
    title: "We Identify Your Challenges",
    text: "Wazambi identifies their biggest challenges and risks.",
  },
  {
    title: "We Recommend The Solution",
    text: "Wazambi recommends the correct solution for their operation.",
  },
  {
    title: "We Install The Equipment",
    text: "Technicians install the equipment on the vehicles.",
  },
  {
    title: "You Monitor Everything",
    text: "The customer monitors everything through their phone or computer.",
  },
  {
    title: "We Keep Supporting You",
    text: "Wazambi provides continued technical support.",
  },
];

export const industries = [
  { title: "Transport and Logistics", problem: "Missed trips, route abuse and paperwork delays cost you every day." },
  { title: "Mining Companies", problem: "Valuable equipment and site vehicle movements need live control." },
  { title: "Bus and Taxi Operators", problem: "Drivers, revenue trips and vehicle safety depend on visibility." },
  { title: "Delivery Companies", problem: "Customers expect proof of delivery and on-time routes." },
  { title: "Construction Companies", problem: "Expensive vehicles and machines must stay within your sites." },
  { title: "Schools and Organisations", problem: "Buses and official vehicles must be tracked and accounted for." },
  { title: "Cross-Border Fleets", problem: "Vehicles leaving the country must remain visible and safe." },
  { title: "Individual Vehicle Owners", problem: "Protect your personal vehicle from theft and misuse." },
];

export const packages: Package[] = [
  {
    name: "GPS Tracking Package",
    tagline: "Live control over where your vehicles go.",
    features: [
      "Live tracking",
      "Trip history",
      "Route playback",
      "Geofences",
      "Ignition status",
      "Speeding alerts",
      "Reports",
    ],
    cta: "Get the GPS Tracking Package",
    href: "/gps-tracking",
  },
  {
    name: "Fuel Control Package",
    tagline: "Record every litre and stop fuel loss.",
    features: [
      "GPS tracking",
      "Fuel monitoring",
      "Fuel-drop alerts",
      "Refuelling information",
      "Fuel-consumption reports",
    ],
    cta: "Get a Fuel Assessment",
    href: "/fuel-assessment",
  },
  {
    name: "Complete Fleet Management Package",
    tagline: "The full system for serious fleets.",
    features: [
      "GPS tracking",
      "Fuel monitoring",
      "Vehicle management",
      "Driver monitoring",
      "Maintenance",
      "Alerts",
      "Fleet reports",
    ],
    cta: "Build My Fleet Solution",
    href: "/fleet-management",
  },
];

export const results: Result[] = [
  {
    customer: "Transport Company",
    company: "Lusaka Freight & Logistics",
    industry: "Transport and Logistics",
    problem: "Management did not know where trucks were between depots, and fuel reports never matched.",
    solution: "Installed GPS tracking and fuel monitoring on 40 trucks with geofences around depots.",
    result: "Unauthorised stops dropped by 60% and fuel consumption fell by 18% in the first three months.",
    image: "/images/results/result-1.jpg",
  },
  {
    customer: "Bus Operator",
    company: "Copperbelt City Buses",
    industry: "Bus and Taxi Operations",
    problem: "Drivers skipped routes and revenue trips were not being reported accurately.",
    solution: "Live tracking, route playback and daily trip reports for every bus.",
    result: "Route compliance improved and the operator now reconciles every trip with records.",
    image: "/images/results/result-2.jpg",
  },
  {
    customer: "Construction Firm",
    company: "Zambia Road Builders",
    industry: "Construction",
    problem: "Expensive equipment moved outside sites during the night without approval.",
    solution: "Geofences, after-hours movement alerts and remote immobilisation.",
    result: "Noise theft attempts stopped and equipment utilisation reports arrived weekly.",
    image: "/images/results/result-3.jpg",
  },
];

export const courses: Course[] = [
  {
    slug: "gps-tracking",
    code: "gps_tracking",
    badge: "Free Course",
    title: "GPS Tracking Course",
    headline: "Do you really know where your vehicles go after they leave?",
    description:
      "Learn how live tracking, geofences, trip history and alerts protect every vehicle in your fleet.",
    image: "/images/courses/gps.jpg",
    whatYouLearn: [
      "How live GPS tracking works",
      "What geofences protect you from",
      "How to read trip history",
      "Why ignition status matters",
      "How speeding alerts reduce risk",
    ],
    guideName: "Wazambi GPS Tracking Guide.pdf",
    cta: "Email Me the Free GPS Tracking Guide",
  },
  {
    slug: "fuel-monitoring",
    code: "fuel_monitoring",
    badge: "Free Course",
    title: "Fuel Monitoring Course",
    headline: "How much money could your business be losing through fuel?",
    description:
      "Monitor fuel levels, refuelling events and suspicious drops with records — not driver explanations.",
    image: "/images/courses/fuel.jpg",
    whatYouLearn: [
      "How fuel-level monitoring works",
      "How refuelling records are captured",
      "How to spot suspicious fuel drops",
      "How consumption reports are built",
      "How vehicle comparisons reveal losses",
    ],
    guideName: "Wazambi Fuel Control Guide.pdf",
    cta: "Email Me the Free Fuel Control Guide",
  },
  {
    slug: "fleet-management",
    code: "fleet_management",
    badge: "Free Course",
    title: "Fleet Management Course",
    headline: "Your fleet cannot improve if you cannot see what is happening.",
    description:
      "Organise vehicles, drivers, maintenance and reporting in one clear system.",
    image: "/images/courses/fleet.jpg",
    whatYouLearn: [
      "How to organise vehicles and drivers",
      "How to monitor unauthorised trips",
      "How maintenance scheduling works",
      "How driver behaviour scoring helps",
      "How fleet reports improve decisions",
    ],
    guideName: "Wazambi Fleet Management Guide.pdf",
    cta: "Email Me the Free Fleet Management Guide",
  },
];

export const faqs: Faq[] = [
  {
    question: "What is Wazambi GPS?",
    answer:
      "Wazambi GPS provides GPS tracking, fuel monitoring and fleet-management systems that help vehicle owners and businesses monitor, protect and control their vehicles — live, from a phone or computer.",
  },
  {
    question: "How does GPS tracking work?",
    answer:
      "A tracking device is installed in the vehicle and sends its live location, movement and ignition status to the Wazambi platform, which you can view from your phone or computer at any time.",
  },
  {
    question: "Can I monitor vehicles from my phone?",
    answer:
      "Yes. The Wazambi platform works on smartphones and computers, so you can see live locations, alerts and reports anywhere.",
  },
  {
    question: "Does Wazambi work outside Zambia?",
    answer:
      "Yes. Wazambi supports local and cross-border tracking, so vehicles can be monitored while travelling within Zambia and beyond its borders.",
  },
  {
    question: "Can Wazambi monitor cross-border vehicles?",
    answer:
      "Yes. Cross-border fleets can be tracked across borders, giving owners visibility of vehicles wherever they travel.",
  },
  {
    question: "Can I view completed journeys?",
    answer:
      "Yes. Every trip is recorded with route playback and trip history, so you can review exactly where a vehicle went and when it stopped.",
  },
  {
    question: "How do geofences work?",
    answer:
      "A geofence is a virtual border you set around an area. When a vehicle enters or leaves the area, you receive an alert immediately.",
  },
  {
    question: "Can Wazambi monitor fuel?",
    answer:
      "Yes. Wazambi monitors fuel levels, records refuelling events and alerts you to suspicious fuel drops, with consumption reports for every vehicle.",
  },
  {
    question: "How does remote immobilisation work?",
    answer:
      "Remote immobilisation lets an authorised operator stop a vehicle from starting. It is used in emergencies, such as when a vehicle is stolen or used without approval.",
  },
  {
    question: "How long does installation take?",
    answer:
      "Most installations are completed in around an hour per vehicle by our trained technicians, with minimal disruption to your operation.",
  },
  {
    question: "Does Wazambi provide technical support?",
    answer:
      "Yes. Wazambi provides continued technical support after installation to keep your system working correctly.",
  },
  {
    question: "How do I request a quotation?",
    answer:
      "Complete the free Fleet Assessment form and the Wazambi team will recommend the right solution and send you a quotation based on your vehicles and challenges.",
  },
  {
    question: "How do I access the Fleet Academy?",
    answer:
      "Visit the Fleet Academy page, choose a free course, watch the lesson and request a free guide — it is sent straight to your email.",
  },
  {
    question: "How do I become an agent?",
    answer:
      "Visit the Become an Agent page, confirm you meet the requirements and apply. Only 100 agents are selected for the training on 1–2 October 2026.",
  },
];

export const courseFaqs: Record<string, Faq[]> = {
  "gps-tracking": faqs.filter((f) =>
    ["What is Wazambi GPS?", "How does GPS tracking work?", "Can I monitor vehicles from my phone?", "Does Wazambi work outside Zambia?", "Can I view completed journeys?", "How do geofences work?", "How does remote immobilisation work?", "How long does installation take?"].includes(f.question)
  ),
  "fuel-monitoring": faqs.filter((f) =>
    ["What is Wazambi GPS?", "Can Wazambi monitor fuel?", "Can I view completed journeys?", "How do I request a quotation?", "How long does installation take?"].includes(f.question)
  ),
  "fleet-management": faqs.filter((f) =>
    ["What is Wazambi GPS?", "How does GPS tracking work?", "What is Wazambi GPS?"].length > 0 && [
      "What is Wazambi GPS?",
      "Can I view completed journeys?",
      "How do geofences work?",
      "Does Wazambi provide technical support?",
      "How do I request a quotation?",
    ].includes(f.question)
  ),
};