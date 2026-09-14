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
  eyebrow: "Live GPS Tracking • Fuel Control • Fleet Management",
  headline: "Do You Know What Your Vehicles Are Doing Right Now?",
  subline:
    "See every vehicle live, uncover fuel losses, control unauthorised trips and manage your entire fleet from your phone.",
  primaryCta: { label: "I'm Ready to Take Control", href: "/fleet-assessment" },
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
    shortHeadline: "Know where every vehicle is — without calling the driver.",
    fullHeadline: "Know Where Every Vehicle Is—Without Calling the Driver.",
    description:
      "See live location, route playback, trip history, geofences, ignition information and vehicle alerts — all in real time.",
    features: ["Live map", "Route playback", "Trip history", "Geofences", "Ignition status", "Vehicle alerts"],
    image: "/images/solutions/gps.jpg",
  },
  {
    slug: "fuel-monitoring",
    title: "Fuel Monitoring",
    shortHeadline: "See where your fuel goes before it becomes another unexplained cost.",
    fullHeadline: "Control Fuel With Records—Not Driver Explanations.",
    description:
      "Real fuel graphs, filling events, fuel drops, consumption reports and fuel-loss alerts for every vehicle.",
    features: ["Fuel graphs", "Filling events", "Fuel drops", "Consumption reports", "Fuel-loss alerts"],
    image: "/images/solutions/fuel.jpg",
  },
  {
    slug: "fleet-management",
    title: "Fleet Management",
    shortHeadline: "Manage vehicles, drivers, maintenance and reports from one organised system.",
    fullHeadline: "Bring Your Vehicles, Drivers, Fuel and Reports Into One System.",
    description:
      "Vehicle lists, driver records, maintenance reminders, fleet reports and performance information in one system.",
    features: ["Vehicle list", "Driver records", "Maintenance reminders", "Fleet reports", "Performance information"],
    image: "/images/solutions/fleet.jpg",
  },
];

export const howItWorks = [
  {
    title: "Tell Us About Your Vehicles",
    text: "Answer a few questions about your vehicles and how they operate.",
  },
  {
    title: "We Recommend the Right Solution",
    text: "Wazambi reviews your operation and recommends the right solution.",
  },
  {
    title: "Wazambi Technicians Install It",
    text: "Trained technicians install the equipment quickly and cleanly.",
  },
  {
    title: "You Monitor Everything From Your Phone",
    text: "Live tracking, fuel and reports — all visible from your phone.",
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
      "Learn how live tracking, geofences, trip history and alerts protect your vehicles.",
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
      "Learn how to identify suspicious fuel activity and understand fuel reports.",
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
      "Learn how to organise vehicles, drivers, maintenance and operating records.",
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
      "Wazambi GPS is a Zambian company that installs live GPS tracking, fuel monitoring and fleet-management systems on vehicles — so owners can see what is happening without relying on phone calls or driver explanations.",
  },
  {
    question: "Can I track my vehicles from my phone?",
    answer:
      "Yes. After installation you can see every vehicle live, check trips and receive alerts from your phone or computer, anywhere.",
  },
  {
    question: "Can I see where a vehicle travelled previously?",
    answer:
      "Yes. Every trip is stored with route playback, so you can review exactly where a vehicle went, when it stopped and how long it stayed.",
  },
  {
    question: "Can Wazambi detect unauthorised vehicle use?",
    answer:
      "Yes. You can set geofences and after-hours rules, and Wazambi alerts you when a vehicle is used outside approved times or areas.",
  },
  {
    question: "How does fuel monitoring work?",
    answer:
      "A fuel sensor records levels, refuelling events and sudden drops. You get consumption reports per vehicle and alerts for suspicious losses.",
  },
  {
    question: "How long does installation take?",
    answer:
      "Most vehicles are installed in around an hour by our trained technicians, with minimal disruption to your operation.",
  },
  {
    question: "Does Wazambi work on cross-border vehicles?",
    answer:
      "Yes. Vehicles can be tracked while travelling within Zambia and beyond its borders.",
  },
  {
    question: "Can I use Wazambi for one vehicle?",
    answer:
      "Yes. Wazambi works for individual vehicle owners as well as businesses running large fleets.",
  },
  {
    question: "Can Wazambi manage a large fleet?",
    answer:
      "Yes. The platform manages vehicles, drivers, fuel, maintenance and reporting — whether you run five vehicles or five hundred.",
  },
  {
    question: "Can the system immobilise a vehicle?",
    answer:
      "Yes. Remote immobilisation lets an authorised operator stop a vehicle from starting in an emergency, such as theft or unauthorised use.",
  },
  {
    question: "What happens if the network disappears?",
    answer:
      "The device keeps recording movements and delivers the records when the signal returns, so you still have a full history.",
  },
  {
    question: "How do I receive a quotation?",
    answer:
      "Complete the free Fleet Assessment and the Wazambi team will recommend the right solution and send you a clear quotation.",
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