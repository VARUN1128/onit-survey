export type RatingLevel = 
  | 'Not Important'
  | 'Slightly Important'
  | 'Important'
  | 'Very Important'
  | 'Extremely Important';

export const CRITERIA_LIST = [
  'Verified and trusted professionals',
  'Affordable pricing',
  'Transparent pricing',
  'Quality of service',
  'Quick availability',
  'On-time service',
  'Customer support',
] as const;

export type CriteriaItem = typeof CRITERIA_LIST[number];

export const RATING_LEVELS: RatingLevel[] = [
  'Not Important',
  'Slightly Important',
  'Important',
  'Very Important',
  'Extremely Important',
];

export interface SurveyFormData {
  // Section 1: About You
  name: string;
  age: string; // number or empty string
  location: string;
  occupation: string;

  // Section 2: Home Service Requirements
  currently_uses_services: 'Yes' | 'No' | 'Sometimes' | '';
  required_services: string[];
  other_service: string;
  service_frequency: 'Weekly' | 'Monthly' | 'Once every 3–6 months' | 'Only when required' | '';

  // Section 3: Current Booking Behaviour
  provider_discovery_methods: string[];
  other_discovery_method: string;
  interested_in_online_platform: 'Yes' | 'Maybe' | 'No' | '';

  // Section 4: Customer Challenges
  booking_challenges: string[];

  // Section 5: Service Expectations
  service_provider_criteria: Partial<Record<CriteriaItem, RatingLevel>>;

  // Section 6: Platform Adoption
  would_use_onit: 'Yes' | 'No' | '';
  referral_name: string;

  // Anti-spam honeypot
  _website_url_hp?: string;
}

export interface SurveySubmissionPayload {
  name: string;
  age: number | null;
  location: string | null;
  occupation: string;
  currently_uses_services: string;
  required_services: string[];
  other_service: string | null;
  service_frequency: string;
  provider_discovery_methods: string[];
  other_discovery_method: string | null;
  interested_in_online_platform: string;
  booking_challenges: string[];
  service_provider_criteria: Record<string, RatingLevel>;
  would_use_onit: string;
  referral_name: string;
}

export type FormErrors = Partial<Record<keyof SurveyFormData | `criteria_${string}`, string>>;
