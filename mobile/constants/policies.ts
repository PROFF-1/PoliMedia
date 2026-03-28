// Mock policy data for PoliMedia
export interface PolicyTag {
  label: string;
  direction: 'up' | 'down' | 'neutral';
}

export interface Policy {
  id: number;
  title: string;
  summary: string;
  category: string;
  tags: PolicyTag[];
  source: string;
  sourceName: string;
  date: string;
  impacts: Record<string, string>;
  impactsByLocation: Record<string, string>;
  deepExplanation: string;
}

export interface PersonalizedPolicy extends Policy {
  personalImpact: string;
  locationImpact: string;
}

const policies: Policy[] = [
  {
    id: 1,
    title: "Fuel Levy Increased by 15%",
    summary:
      "Government has approved a 15% increase in fuel levy effective next month. This affects petrol, diesel, and kerosene prices nationwide.",
    category: "transport",
    tags: [
      { label: "Transport", direction: "up" },
      { label: "Food Prices", direction: "up" },
    ],
    source: "https://mofep.gov.gh",
    sourceName: "Ministry of Finance",
    date: "2026-03-25",
    impacts: {
      student: "Your daily commute costs will rise. Budget an extra 10-15% for transport to campus.",
      developer: "Remote work saves you commute costs, but food delivery and ride-hailing prices will increase.",
      trader: "Your supply chain costs will increase. Goods transported by road will cost more to stock.",
      healthcare: "Ambulance and medical supply delivery costs will rise, potentially affecting service fees.",
      farmer: "Fuel for machinery and transport to market will cost more, squeezing your margins.",
      default: "Transport and food prices are likely to increase in your area.",
    },
    impactsByLocation: {
      urban: "You'll feel this most in daily ride-hailing and delivery costs.",
      rural: "Fewer transport options means you're more dependent on fuel — this hits harder.",
    },
    deepExplanation:
      "The fuel levy is a tax added to every litre of fuel sold. When it goes up, the price at the pump increases immediately. But the ripple effects are bigger — since almost everything is transported by road, the cost of food, goods, and services tends to follow. For young people, this means higher trotro/Uber fares, pricier deliveries, and more expensive meals at your favorite spot.",
  },
  {
    id: 2,
    title: "E-Levy Officially Scrapped",
    summary:
      "The Electronic Transaction Levy (E-Levy) has been officially removed. Mobile money transactions will no longer attract the 1% charge.",
    category: "finance",
    tags: [
      { label: "Mobile Money", direction: "down" },
      { label: "Digital Payments", direction: "down" },
    ],
    source: "https://gra.gov.gh",
    sourceName: "Ghana Revenue Authority",
    date: "2026-03-22",
    impacts: {
      student: "Sending and receiving money via MoMo is now free of the levy — more of your allowance stays with you.",
      developer: "Freelance payments and mobile money cashouts will no longer lose 1% to taxes.",
      trader: "Your MoMo payments from customers and suppliers are now cheaper. Better margins on small transactions.",
      healthcare: "Patient payments via mobile money will no longer incur extra charges.",
      farmer: "Selling produce and receiving payments via mobile money is now fully levy-free.",
      default: "Your mobile money transactions are now free from the 1% e-levy charge.",
    },
    impactsByLocation: {
      urban: "Great news for your daily MoMo transactions — food, rides, and splits are cheaper.",
      rural: "Mobile money is often your primary banking — this removal saves you real money.",
    },
    deepExplanation:
      "The E-Levy was a 1% tax on electronic transactions above a daily threshold. For a generation that lives on mobile money — splitting bills, paying for rides, receiving freelance income — this tax ate into every transaction. Its removal means that if you send GHS 100, the full GHS 100 arrives. No more hidden deductions.",
  },
  {
    id: 3,
    title: "Free SHS Program Expanded",
    summary:
      "Government announces expansion of Free Senior High School program with increased funding for STEM labs and digital infrastructure.",
    category: "education",
    tags: [
      { label: "Education", direction: "neutral" },
      { label: "STEM", direction: "up" },
    ],
    source: "https://moe.gov.gh",
    sourceName: "Ministry of Education",
    date: "2026-03-20",
    impacts: {
      student: "If you're in SHS, expect better labs and computer facilities. University-bound students benefit from stronger STEM foundations.",
      developer: "More STEM graduates entering the pipeline means a growing tech ecosystem — and more competition.",
      trader: "Not directly affected, but a more educated workforce means better-skilled employees in the future.",
      healthcare: "Better science education means more qualified applicants for health training institutions.",
      farmer: "Agricultural science programs in schools will get better resources and equipment.",
      default: "Education access is expanding, which strengthens the overall workforce and economy.",
    },
    impactsByLocation: {
      urban: "Urban schools get digital labs and faster internet for e-learning.",
      rural: "Rural schools are prioritized for new STEM lab installations — this bridges the gap.",
    },
    deepExplanation:
      "Free SHS already removed tuition barriers, but quality gaps remained — especially in STEM. This expansion adds funding for science labs, computer rooms, and teacher training. For a country trying to build a digital economy, this is foundational.",
  },
  {
    id: 4,
    title: "New Rent Control Bill Passed",
    summary:
      "Parliament passes new rent control legislation capping annual rent increases at 10% and requiring 2-month notice before any increase.",
    category: "housing",
    tags: [
      { label: "Rent", direction: "down" },
      { label: "Housing", direction: "neutral" },
    ],
    source: "https://parliament.gov.gh",
    sourceName: "Parliament of Ghana",
    date: "2026-03-18",
    impacts: {
      student: "If you rent near campus, your landlord can't spike rent beyond 10% anymore. More predictable housing costs.",
      developer: "Rent stability means better financial planning. No more surprise 50% rent increases.",
      trader: "Shop rents are also covered — your market stall or shop rent can't jump unpredictably.",
      healthcare: "Stable housing costs help you plan better on your salary, especially in high-demand urban areas.",
      farmer: "Less direct impact if you own land, but rented storage and market spaces are now protected.",
      default: "Rent increases are now capped at 10% per year with mandatory advance notice.",
    },
    impactsByLocation: {
      urban: "This hits hardest in cities like Accra and Kumasi where rent hikes have been extreme.",
      rural: "Less immediate impact, but sets a precedent for fair housing nationally.",
    },
    deepExplanation:
      "Ghana's rental market has been chaotic — landlords demanding 2-3 years advance rent, sudden 30-50% hikes, even evictions without notice. This new bill introduces real protections: a 10% cap on annual increases, mandatory 2-month notice before changes, and a formal complaint mechanism.",
  },
  {
    id: 5,
    title: "National Health Insurance Covers Mental Health",
    summary:
      "NHIS now covers outpatient mental health consultations, counseling sessions, and basic psychiatric medication.",
    category: "health",
    tags: [
      { label: "Mental Health", direction: "up" },
      { label: "Healthcare", direction: "neutral" },
    ],
    source: "https://nhis.gov.gh",
    sourceName: "National Health Insurance Authority",
    date: "2026-03-15",
    impacts: {
      student: "You can now access free counseling and mental health support with your NHIS card. No more out-of-pocket costs.",
      developer: "Burnout and stress are real in tech. NHIS now covers therapy sessions — use your card.",
      trader: "The stress of running a business is recognized. You can access mental health support affordably.",
      healthcare: "Your workload may increase as demand rises, but it validates mental health as essential care.",
      farmer: "Isolation and financial stress are common — counseling is now accessible at NHIS-accredited facilities.",
      default: "Mental health consultations and basic treatment are now covered by your NHIS card.",
    },
    impactsByLocation: {
      urban: "More mental health facilities in cities means easier access to covered services.",
      rural: "Access may be limited initially, but mobile/telehealth mental health services are being rolled out.",
    },
    deepExplanation:
      "Mental health has been severely underfunded in Ghana — the entire country has fewer than 100 psychiatrists. By adding mental health to NHIS coverage, the government is acknowledging that anxiety, depression, and stress are real health issues, not 'weakness.'",
  },
  {
    id: 6,
    title: "Digital Addressing System Now Mandatory",
    summary:
      "All businesses and residences must register with the Ghana Digital Address system. Delivery services must integrate GPS-based addresses.",
    category: "technology",
    tags: [
      { label: "Tech", direction: "up" },
      { label: "E-Commerce", direction: "up" },
    ],
    source: "https://digitaladdress.gov.gh",
    sourceName: "Ghana Post Digital",
    date: "2026-03-10",
    impacts: {
      student: "Package deliveries to your hostel/hall will be more reliable — no more 'meet me at the junction.'",
      developer: "Huge opportunity — apps and services need to integrate this API. More jobs and projects in location tech.",
      trader: "Your business gets a verifiable address. Online customers can find and trust you more easily.",
      healthcare: "Emergency services can locate patients faster. Ambulance dispatch becomes more efficient.",
      farmer: "Your farm gets a digital address — easier for buyers and logistics companies to reach you.",
      default: "Ghana's addressing system is going digital, making deliveries and location services more reliable.",
    },
    impactsByLocation: {
      urban: "E-commerce and delivery services will become much more reliable in cities.",
      rural: "This finally puts rural areas on the digital map — literally. Emergency services can find you.",
    },
    deepExplanation:
      "Ever tried to describe your location in Ghana? 'Turn left at the blue kiosk, then ask for Auntie Grace's house.' The Digital Addressing System assigns a unique code to every 5-meter square in the country. Making it mandatory means e-commerce can actually deliver to your door.",
  },
];

export function getPersonalizedPolicies(
  occupation: string,
  location: string
): PersonalizedPolicy[] {
  return policies.map((policy) => ({
    ...policy,
    personalImpact: policy.impacts[occupation] || policy.impacts.default,
    locationImpact: policy.impactsByLocation[location] || '',
  }));
}

export default policies;
