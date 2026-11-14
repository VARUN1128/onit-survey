import React, { useState, useId } from 'react';
import { 
  Check, 
  Send, 
  Loader2, 
  AlertTriangle, 
  HelpCircle,
  Wrench,
  Zap,
  Sparkles,
  Wind,
  Tv,
  PaintBucket,
  Bug,
  Trees,
  Hammer,
  Shirt,
  MoreHorizontal,
  Search,
  Users,
  MapPin,
  Share2,
  Smartphone,
  ShieldAlert,
  CircleDollarSign,
  AlertCircle,
  CalendarX,
  Clock,
  EyeOff,
  Star
} from 'lucide-react';
import { SurveySection } from './SurveySection';
import { QuestionCard } from './QuestionCard';
import { 
  CRITERIA_LIST, 
  RATING_LEVELS, 
  CriteriaItem, 
  RatingLevel, 
  SurveyFormData, 
  FormErrors,
  SurveySubmissionPayload 
} from '../types/survey';
import { submitSurveyResponse } from '../lib/supabase';

interface SurveyFormProps {
  formData: SurveyFormData;
  setFormData: React.Dispatch<React.SetStateAction<SurveyFormData>>;
  onSubmissionSuccess: () => void;
  formRef: React.RefObject<HTMLFormElement>;
}

// Icons mapping for service options
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'Plumbing': <Wrench className="w-4 h-4 text-[#6E76E0]" />,
  'Electrical': <Zap className="w-4 h-4 text-[#6E76E0]" />,
  'House cleaning': <Sparkles className="w-4 h-4 text-[#6E76E0]" />,
  'AC service': <Wind className="w-4 h-4 text-[#6E76E0]" />,
  'Appliance repair': <Tv className="w-4 h-4 text-[#6E76E0]" />,
  'Painting': <PaintBucket className="w-4 h-4 text-[#6E76E0]" />,
  'Pest control': <Bug className="w-4 h-4 text-[#6E76E0]" />,
  'Gardening': <Trees className="w-4 h-4 text-[#6E76E0]" />,
  'Carpenter': <Hammer className="w-4 h-4 text-[#6E76E0]" />,
  'Laundry': <Shirt className="w-4 h-4 text-[#6E76E0]" />,
  'Other': <MoreHorizontal className="w-4 h-4 text-[#6E76E0]" />,
};

// Icons mapping for discovery methods
const DISCOVERY_ICONS: Record<string, React.ReactNode> = {
  'Google Search': <Search className="w-4 h-4 text-[#6E76E0]" />,
  'Friends and Family': <Users className="w-4 h-4 text-[#6E76E0]" />,
  'Local service providers': <MapPin className="w-4 h-4 text-[#6E76E0]" />,
  'Social media': <Share2 className="w-4 h-4 text-[#6E76E0]" />,
  'Online platforms / apps': <Smartphone className="w-4 h-4 text-[#6E76E0]" />,
  'Other': <MoreHorizontal className="w-4 h-4 text-[#6E76E0]" />,
};

// Icons mapping for customer challenges
const CHALLENGE_ICONS: Record<string, React.ReactNode> = {
  'Finding trusted professionals': <ShieldAlert className="w-4 h-4 text-[#6E76E0]" />,
  'High service charges': <CircleDollarSign className="w-4 h-4 text-[#6E76E0]" />,
  'Poor service quality': <AlertCircle className="w-4 h-4 text-[#6E76E0]" />,
  'Lack of availability': <CalendarX className="w-4 h-4 text-[#6E76E0]" />,
  'Delayed responses': <Clock className="w-4 h-4 text-[#6E76E0]" />,
  'No transparent pricing': <EyeOff className="w-4 h-4 text-[#6E76E0]" />,
};

const HOME_SERVICES_OPTIONS = [
  'Plumbing',
  'Electrical',
  'House cleaning',
  'AC service',
  'Appliance repair',
  'Painting',
  'Pest control',
  'Gardening',
  'Carpenter',
  'Laundry',
  'Other',
];

const DISCOVERY_METHODS = [
  'Google Search',
  'Friends and Family',
  'Local service providers',
  'Social media',
  'Online platforms / apps',
  'Other',
];

const CHALLENGES_OPTIONS = [
  'Finding trusted professionals',
  'High service charges',
  'Poor service quality',
  'Lack of availability',
  'Delayed responses',
  'No transparent pricing',
];

// Short labels for mobile rating matrix segments
const RATING_SHORT_LABELS: Record<RatingLevel, { short: string; step: number }> = {
  'Not Important': { short: 'Not', step: 1 },
  'Slightly Important': { short: 'Slight', step: 2 },
  'Important': { short: 'Import.', step: 3 },
  'Very Important': { short: 'Very', step: 4 },
  'Extremely Important': { short: 'Extreme', step: 5 },
};

export const SurveyForm: React.FC<SurveyFormProps> = ({
  formData,
  setFormData,
  onSubmissionSuccess,
  formRef,
}) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const nameInputId = useId();
  const ageInputId = useId();
  const locationInputId = useId();
  const occupationInputId = useId();
  const otherServiceInputId = useId();
  const otherDiscoveryInputId = useId();
  const referralInputId = useId();

  // Helper to clear a field's error when user modifies it
  const clearFieldError = (fieldKey: keyof SurveyFormData | `criteria_${string}`) => {
    if (errors[fieldKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldKey];
        return next;
      });
    }
    if (submissionError) {
      setSubmissionError(null);
    }
  };

  // Input change handler
  const handleTextChange = (field: keyof SurveyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  // Single select handler
  const handleSingleSelect = (field: keyof SurveyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  // Multi select handler
  const handleMultiSelectToggle = (field: 'required_services' | 'provider_discovery_methods' | 'booking_challenges', item: string) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      const exists = current.includes(item);
      const updated = exists 
        ? current.filter((x) => x !== item)
        : [...current, item];
      return { ...prev, [field]: updated };
    });
    clearFieldError(field);
  };

  // Criteria rating matrix handler
  const handleCriteriaChange = (criterion: CriteriaItem, rating: RatingLevel) => {
    setFormData((prev) => ({
      ...prev,
      service_provider_criteria: {
        ...prev.service_provider_criteria,
        [criterion]: rating,
      },
    }));
    clearFieldError('service_provider_criteria');
    clearFieldError(`criteria_${criterion}`);
  };

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Q1: Name (Required)
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    // Q2: Age (Optional, 13–100)
    if (formData.age.trim() !== '') {
      const ageNum = Number(formData.age);
      if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
        newErrors.age = 'Please enter a valid age between 13 and 100.';
      }
    }

    // Q4: Occupation (Required)
    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Please enter your occupation.';
    }

    // Q5: Currently uses services (Required)
    if (!formData.currently_uses_services) {
      newErrors.currently_uses_services = 'Please select an option.';
    }

    // Q6: Required services (Required at least 1, specify if 'Other')
    if (formData.required_services.length === 0) {
      newErrors.required_services = 'Please select at least one home service.';
    } else if (formData.required_services.includes('Other') && !formData.other_service.trim()) {
      newErrors.other_service = 'Please specify the other service.';
    }

    // Q7: Service frequency (Required)
    if (!formData.service_frequency) {
      newErrors.service_frequency = 'Please select your service frequency.';
    }

    // Q8: Discovery methods (Required at least 1, specify if 'Other')
    if (formData.provider_discovery_methods.length === 0) {
      newErrors.provider_discovery_methods = 'Please select how you find service providers.';
    } else if (formData.provider_discovery_methods.includes('Other') && !formData.other_discovery_method.trim()) {
      newErrors.other_discovery_method = 'Please specify the other discovery method.';
    }

    // Q9: Interested in online platform (Required)
    if (!formData.interested_in_online_platform) {
      newErrors.interested_in_online_platform = 'Please select an option.';
    }

    // Q10: Booking challenges (Required at least 1)
    if (formData.booking_challenges.length === 0) {
      newErrors.booking_challenges = 'Please select at least one challenge.';
    }

    // Q11: Service provider criteria (Every criterion must have one response)
    const missingCriteria = CRITERIA_LIST.filter(
      (criterion) => !formData.service_provider_criteria[criterion]
    );
    if (missingCriteria.length > 0) {
      newErrors.service_provider_criteria = `Please rate all criteria (${missingCriteria.length} remaining).`;
    }

    // Q12: Would use ONIT (Required)
    if (!formData.would_use_onit) {
      newErrors.would_use_onit = 'Please select an option.';
    }

    // Q13: Referral name (Required)
    if (!formData.referral_name.trim()) {
      newErrors.referral_name = "Please enter a name or write 'None'.";
    }

    setErrors(newErrors);

    // Scroll to first invalid field if errors exist
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const elementId = `question-${firstErrorKey}`;
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam Honeypot Check
    if (formData._website_url_hp && formData._website_url_hp.length > 0) {
      onSubmissionSuccess();
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    // Prepare payload
    const payload: SurveySubmissionPayload = {
      name: formData.name.trim(),
      age: formData.age.trim() ? parseInt(formData.age, 10) : null,
      location: formData.location.trim() ? formData.location.trim() : null,
      occupation: formData.occupation.trim(),
      currently_uses_services: formData.currently_uses_services,
      required_services: formData.required_services,
      other_service: formData.required_services.includes('Other') && formData.other_service.trim() 
        ? formData.other_service.trim() 
        : null,
      service_frequency: formData.service_frequency,
      provider_discovery_methods: formData.provider_discovery_methods,
      other_discovery_method: formData.provider_discovery_methods.includes('Other') && formData.other_discovery_method.trim() 
        ? formData.other_discovery_method.trim() 
        : null,
      interested_in_online_platform: formData.interested_in_online_platform,
      booking_challenges: formData.booking_challenges,
      service_provider_criteria: formData.service_provider_criteria as Record<string, RatingLevel>,
      would_use_onit: formData.would_use_onit,
      referral_name: formData.referral_name.trim(),
    };

    const result = await submitSurveyResponse(payload);

    setIsSubmitting(false);

    if (result.success) {
      onSubmissionSuccess();
    } else {
      setSubmissionError(
        result.error || 'Failed to submit your survey response. Please check your network and try again.'
      );
    }
  };

  const ratedCriteriaCount = Object.keys(formData.service_provider_criteria).length;

  return (
    <form 
      ref={formRef} 
      onSubmit={handleSubmit} 
      noValidate 
      className="space-y-6 sm:space-y-8 pb-16 md:pb-6"
      aria-label="ONIT Customer Interest Survey"
    >
      {/* Honeypot field for bot protection */}
      <div 
        aria-hidden="true" 
        style={{ display: 'none', position: 'absolute', left: '-9999px' }}
      >
        <label htmlFor="_website_url_hp">Leave this field blank</label>
        <input
          type="text"
          id="_website_url_hp"
          name="_website_url_hp"
          value={formData._website_url_hp || ''}
          onChange={(e) => handleTextChange('_website_url_hp', e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* SECTION 01: About You */}
      <SurveySection
        number="01"
        title="About You"
        description="A few basic details to help contextualise your feedback."
      >
        {/* Q1: Name */}
        <QuestionCard
          id="name"
          questionNumber="Q1"
          title="What is your name?"
          required
          error={errors.name}
        >
          <input
            id={nameInputId}
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            value={formData.name}
            onChange={(e) => handleTextChange('name', e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-4 py-3.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-[#6E76E0] focus:ring-2 focus:ring-[#6E76E0]/20 transition-all text-base sm:text-sm"
          />
        </QuestionCard>

        {/* Q2: Age */}
        <QuestionCard
          id="age"
          questionNumber="Q2"
          title="What is your age?"
          subtitle="Optional, between 13 and 100."
          error={errors.age}
        >
          <input
            id={ageInputId}
            type="number"
            inputMode="numeric"
            min={13}
            max={100}
            value={formData.age}
            onChange={(e) => handleTextChange('age', e.target.value)}
            placeholder="e.g. 29"
            className="w-full sm:w-48 px-4 py-3.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-[#6E76E0] focus:ring-2 focus:ring-[#6E76E0]/20 transition-all text-base sm:text-sm"
          />
        </QuestionCard>

        {/* Q3: Location */}
        <QuestionCard
          id="location"
          questionNumber="Q3"
          title="Where are you located?"
          subtitle="Optional"
          error={errors.location}
        >
          <input
            id={locationInputId}
            type="text"
            autoComplete="address-level2"
            value={formData.location}
            onChange={(e) => handleTextChange('location', e.target.value)}
            placeholder="Enter your city / locality"
            className="w-full px-4 py-3.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-[#6E76E0] focus:ring-2 focus:ring-[#6E76E0]/20 transition-all text-base sm:text-sm"
          />
        </QuestionCard>

        {/* Q4: Occupation */}
        <QuestionCard
          id="occupation"
          questionNumber="Q4"
          title="What is your occupation?"
          required
          error={errors.occupation}
        >
          <input
            id={occupationInputId}
            type="text"
            autoComplete="organization-title"
            value={formData.occupation}
            onChange={(e) => handleTextChange('occupation', e.target.value)}
            placeholder="e.g. Software Engineer, Doctor, Homemaker, Teacher"
            className="w-full px-4 py-3.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-[#6E76E0] focus:ring-2 focus:ring-[#6E76E0]/20 transition-all text-base sm:text-sm"
          />
        </QuestionCard>
      </SurveySection>

      {/* SECTION 02: Home Service Requirements */}
      <SurveySection
        number="02"
        title="Home Service Requirements"
        description="Tell us about the home services you rely on."
      >
        {/* Q5: Currently use services */}
        <QuestionCard
          id="currently_uses_services"
          questionNumber="Q5"
          title="Do you currently use home services?"
          required
          error={errors.currently_uses_services}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3" role="radiogroup" aria-label="Do you currently use home services?">
            {(['Yes', 'No', 'Sometimes'] as const).map((option) => {
              const isSelected = formData.currently_uses_services === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSingleSelect('currently_uses_services', option)}
                  className={`min-h-[50px] flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer text-left active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[#F2F3FC] border-[#6E76E0] text-[#14143A] ring-1 ring-[#6E76E0] shadow-xs'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50/70'
                  }`}
                >
                  <span className="text-sm">{option}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-[#6E76E0] bg-[#6E76E0]'
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </QuestionCard>

        {/* Q6: Services used/required */}
        <QuestionCard
          id="required_services"
          questionNumber="Q6"
          title="Which home services do you use or require?"
          subtitle="Select all that apply."
          required
          error={errors.required_services}
        >
          {/* Quick Counter */}
          {formData.required_services.length > 0 && (
            <div className="mb-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F2F3FC] text-[#14143A] text-xs font-bold border border-[#6E76E0]/20">
                <Check className="w-3 h-3 text-[#6E76E0]" />
                {formData.required_services.length} services selected
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {HOME_SERVICES_OPTIONS.map((service) => {
              const isSelected = formData.required_services.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => handleMultiSelectToggle('required_services', service)}
                  className={`min-h-[48px] flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer text-left active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[#F2F3FC] border-[#6E76E0] text-[#14143A] font-semibold ring-1 ring-[#6E76E0]'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {SERVICE_ICONS[service] || <HelpCircle className="w-4 h-4 text-[#6E76E0]" />}
                    <span className="text-sm">{service}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                      isSelected
                        ? 'border-[#6E76E0] bg-[#6E76E0] text-white'
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Conditional "Other" input */}
          {formData.required_services.includes('Other') && (
            <div className="mt-3.5 pt-3 border-t border-neutral-200/80 animate-fadeIn">
              <label 
                htmlFor={otherServiceInputId} 
                className="block text-xs font-semibold text-neutral-700 mb-1.5"
              >
                Please specify the other service: <span className="text-rose-500">*</span>
              </label>
              <input
                id={otherServiceInputId}
                type="text"
                value={formData.other_service}
                onChange={(e) => handleTextChange('other_service', e.target.value)}
                placeholder="e.g. Masonry, CCTV installation, Interior decor"
                className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-[#6E76E0] focus:ring-2 focus:ring-[#6E76E0]/20 transition-all text-base sm:text-sm"
              />
              {errors.other_service && (
                <p className="text-xs text-rose-600 font-semibold mt-1.5">
                  {errors.other_service}
                </p>
              )}
            </div>
          )}
        </QuestionCard>

        {/* Q7: Service frequency */}
        <QuestionCard
          id="service_frequency"
          questionNumber="Q7"
          title="How frequently do you require home services?"
          required
          error={errors.service_frequency}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3" role="radiogroup" aria-label="How frequently do you require home services?">
            {(['Weekly', 'Monthly', 'Once every 3–6 months', 'Only when required'] as const).map(
              (freq) => {
                const isSelected = formData.service_frequency === freq;
                return (
                  <button
                    key={freq}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSingleSelect('service_frequency', freq)}
                    className={`min-h-[50px] flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer text-left active:scale-[0.98] ${
                      isSelected
                        ? 'bg-[#F2F3FC] border-[#6E76E0] text-[#14143A] ring-1 ring-[#6E76E0] shadow-xs'
                        : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50/70'
                    }`}
                  >
                    <span>{freq}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-[#6E76E0] bg-[#6E76E0]'
                          : 'border-neutral-300 bg-white'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </QuestionCard>
      </SurveySection>

      {/* SECTION 03: Current Booking Behaviour */}
      <SurveySection
        number="03"
        title="Current Booking Behaviour"
        description="How you currently find and decide on home service professionals."
      >
        {/* Q8: How do you usually find providers */}
        <QuestionCard
          id="provider_discovery_methods"
          questionNumber="Q8"
          title="How do you usually find home service providers?"
          subtitle="Select all that apply."
          required
          error={errors.provider_discovery_methods}
        >
          {formData.provider_discovery_methods.length > 0 && (
            <div className="mb-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F2F3FC] text-[#14143A] text-xs font-bold border border-[#6E76E0]/20">
                <Check className="w-3 h-3 text-[#6E76E0]" />
                {formData.provider_discovery_methods.length} methods selected
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {DISCOVERY_METHODS.map((method) => {
              const isSelected = formData.provider_discovery_methods.includes(method);
              return (
                <button
                  key={method}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => handleMultiSelectToggle('provider_discovery_methods', method)}
                  className={`min-h-[48px] flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer text-left active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[#F2F3FC] border-[#6E76E0] text-[#14143A] font-semibold ring-1 ring-[#6E76E0]'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {DISCOVERY_ICONS[method] || <Search className="w-4 h-4 text-[#6E76E0]" />}
                    <span>{method}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                      isSelected
                        ? 'border-[#6E76E0] bg-[#6E76E0] text-white'
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Conditional "Other" input for discovery methods */}
          {formData.provider_discovery_methods.includes('Other') && (
            <div className="mt-3.5 pt-3 border-t border-neutral-200/80 animate-fadeIn">
              <label 
                htmlFor={otherDiscoveryInputId} 
                className="block text-xs font-semibold text-neutral-700 mb-1.5"
              >
                Please specify the other discovery method: <span className="text-rose-500">*</span>
              </label>
              <input
                id={otherDiscoveryInputId}
                type="text"
                value={formData.other_discovery_method}
                onChange={(e) => handleTextChange('other_discovery_method', e.target.value)}
                placeholder="e.g. Newspaper adverts, community flyers"
                className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-[#6E76E0] focus:ring-2 focus:ring-[#6E76E0]/20 transition-all text-base sm:text-sm"
              />
              {errors.other_discovery_method && (
                <p className="text-xs text-rose-600 font-semibold mt-1.5">
                  {errors.other_discovery_method}
                </p>
              )}
            </div>
          )}
        </QuestionCard>

        {/* Q9: Interest in online platform */}
        <QuestionCard
          id="interested_in_online_platform"
          questionNumber="Q9"
          title="Would you be interested in using an online platform to book trusted home services?"
          required
          error={errors.interested_in_online_platform}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3" role="radiogroup" aria-label="Would you be interested in using an online platform to book trusted home services?">
            {(['Yes', 'Maybe', 'No'] as const).map((option) => {
              const isSelected = formData.interested_in_online_platform === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSingleSelect('interested_in_online_platform', option)}
                  className={`min-h-[50px] flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer text-left active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[#F2F3FC] border-[#6E76E0] text-[#14143A] ring-1 ring-[#6E76E0] shadow-xs'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50/70'
                  }`}
                >
                  <span>{option}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-[#6E76E0] bg-[#6E76E0]'
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </QuestionCard>
      </SurveySection>

      {/* SECTION 04: Customer Challenges */}
      <SurveySection
        number="04"
        title="Customer Challenges"
        description="Help us understand the friction and bottlenecks in your current experience."
      >
        {/* Q10: Biggest challenges */}
        <QuestionCard
          id="booking_challenges"
          questionNumber="Q10"
          title="What is your biggest challenge when booking home services?"
          subtitle="You can select multiple options based on your experiences."
          required
          error={errors.booking_challenges}
        >
          {formData.booking_challenges.length > 0 && (
            <div className="mb-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F2F3FC] text-[#14143A] text-xs font-bold border border-[#6E76E0]/20">
                <Check className="w-3 h-3 text-[#6E76E0]" />
                {formData.booking_challenges.length} challenges selected
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {CHALLENGES_OPTIONS.map((challenge) => {
              const isSelected = formData.booking_challenges.includes(challenge);
              return (
                <button
                  key={challenge}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => handleMultiSelectToggle('booking_challenges', challenge)}
                  className={`min-h-[52px] flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-sm font-medium transition-all cursor-pointer text-left active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[#F2F3FC] border-[#6E76E0] text-[#14143A] font-semibold ring-1 ring-[#6E76E0]'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3 pr-2">
                    {CHALLENGE_ICONS[challenge] || <AlertCircle className="w-4 h-4 text-[#6E76E0]" />}
                    <span className="leading-snug">{challenge}</span>
                  </div>
                  <div
                    className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-[#6E76E0] bg-[#6E76E0] text-white'
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </QuestionCard>
      </SurveySection>

      {/* SECTION 05: Service Expectations */}
      <SurveySection
        number="05"
        title="Service Expectations"
        description="Rate the importance of each factor when deciding on a service provider."
      >
        {/* Q11: Rating matrix */}
        <QuestionCard
          id="service_provider_criteria"
          questionNumber="Q11"
          title="How important are the following when choosing a service provider?"
          subtitle="Please select an importance level for each of the 7 criteria below."
          required
          error={errors.service_provider_criteria}
        >
          {/* Progress / Completion Badge */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">
              Criteria Rated: <strong className="text-[#14143A]">{ratedCriteriaCount} / {CRITERIA_LIST.length}</strong>
            </span>
            {ratedCriteriaCount === CRITERIA_LIST.length ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <Check className="w-3 h-3 text-emerald-600" /> All 7 rated ✨
              </span>
            ) : (
              <span className="text-[11px] text-[#6E76E0] font-medium">
                {CRITERIA_LIST.length - ratedCriteriaCount} remaining
              </span>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/90 border-b border-neutral-200 text-xs font-semibold text-neutral-600">
                  <th className="py-3 px-4 min-w-[220px]">Criteria</th>
                  {RATING_LEVELS.map((level) => (
                    <th key={level} className="py-3 px-2 text-center text-[11px] font-bold text-neutral-700 min-w-[90px]">
                      {level}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {CRITERIA_LIST.map((criterion, idx) => {
                  const currentRating = formData.service_provider_criteria[criterion];
                  const hasSelection = Boolean(currentRating);
                  return (
                    <tr 
                      key={criterion} 
                      className={`transition-colors ${
                        !hasSelection && errors.service_provider_criteria 
                          ? 'bg-rose-50/30' 
                          : idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/40'
                      } hover:bg-[#F2F3FC]/50`}
                    >
                      <td className="py-3.5 px-4 font-medium text-neutral-800 text-xs sm:text-sm">
                        <span className="flex items-center gap-1.5">
                          {criterion}
                          {hasSelection ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 inline" />
                          ) : (
                            <span className="text-neutral-400 text-xs">*</span>
                          )}
                        </span>
                      </td>
                      {RATING_LEVELS.map((level) => {
                        const isSelected = currentRating === level;
                        return (
                          <td key={level} className="py-3 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleCriteriaChange(criterion, level)}
                              title={`${criterion}: ${level}`}
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-full border transition-all cursor-pointer active:scale-95 ${
                                isSelected
                                  ? 'border-[#6E76E0] bg-[#6E76E0] text-white shadow-xs scale-105 ring-2 ring-[#6E76E0]/20'
                                  : 'border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-100'
                              }`}
                            >
                              {isSelected ? (
                                <span className="w-2.5 h-2.5 rounded-full bg-white" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Optimized Tactile Segmented Rating Cards */}
          <div className="md:hidden space-y-3">
            {CRITERIA_LIST.map((criterion, idx) => {
              const currentRating = formData.service_provider_criteria[criterion];
              const isFilled = Boolean(currentRating);
              return (
                <div 
                  key={criterion}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isFilled 
                      ? 'bg-white border-neutral-300 shadow-2xs' 
                      : errors.service_provider_criteria 
                        ? 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-200' 
                        : 'bg-white border-neutral-200'
                  }`}
                >
                  {/* Card Title & Selected Rating Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <span className="text-xs font-bold text-[#14143A] leading-snug">
                      <span className="text-[#6E76E0] mr-1">{idx + 1}.</span> {criterion}
                    </span>
                    {isFilled ? (
                      <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-[#14143A] bg-[#F2F3FC] border border-[#6E76E0]/30 px-2.5 py-0.5 rounded-full">
                        <Star className="w-3 h-3 text-[#6E76E0] fill-[#6E76E0]" />
                        {currentRating}
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                  </div>

                  {/* 5-Segment Tactile Tap Bar for Mobile */}
                  <div className="grid grid-cols-5 gap-1.5 bg-neutral-100/80 p-1 rounded-xl">
                    {RATING_LEVELS.map((level) => {
                      const isSelected = currentRating === level;
                      const { short, step } = RATING_SHORT_LABELS[level];
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleCriteriaChange(criterion, level)}
                          className={`min-h-[46px] py-1.5 px-1 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
                            isSelected
                              ? 'bg-[#14143A] text-white shadow-sm ring-1 ring-[#14143A]'
                              : 'bg-white text-neutral-700 hover:bg-neutral-50 shadow-2xs'
                          }`}
                        >
                          <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-[#6E76E0]'}`}>
                            {step}
                          </span>
                          <span className={`text-[10px] leading-tight font-medium ${isSelected ? 'text-neutral-200 font-bold' : 'text-neutral-500'}`}>
                            {short}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Helper Scale Label */}
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 px-1 mt-1 font-medium">
                    <span>1: Not Important</span>
                    <span>5: Extremely</span>
                  </div>
                </div>
              );
            })}
          </div>
        </QuestionCard>
      </SurveySection>

      {/* SECTION 06: Platform Adoption */}
      <SurveySection
        number="06"
        title="Platform Adoption"
        description="Final thoughts on your readiness to use ONIT and recommend it."
      >
        {/* Q12: Will you use ONIT */}
        <QuestionCard
          id="would_use_onit"
          questionNumber="Q12"
          title="Will you use our platform if all of the above criteria are met?"
          required
          error={errors.would_use_onit}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3" role="radiogroup" aria-label="Will you use our platform if all of the above criteria are met?">
            {(['Yes', 'No'] as const).map((option) => {
              const isSelected = formData.would_use_onit === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSingleSelect('would_use_onit', option)}
                  className={`min-h-[50px] flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer text-left active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[#F2F3FC] border-[#6E76E0] text-[#14143A] ring-1 ring-[#6E76E0] shadow-xs'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50/70'
                  }`}
                >
                  <span>{option}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-[#6E76E0] bg-[#6E76E0]'
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </QuestionCard>

        {/* Q13: Referral Name */}
        <QuestionCard
          id="referral_name"
          questionNumber="Q13"
          title="Who can you recommend us to?"
          subtitle="Do you know someone who might find ONIT useful? Share their name."
          required
          error={errors.referral_name}
        >
          <input
            id={referralInputId}
            type="text"
            autoCapitalize="words"
            value={formData.referral_name}
            onChange={(e) => handleTextChange('referral_name', e.target.value)}
            placeholder="Enter the person's name (or write 'None')"
            className="w-full px-4 py-3.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-[#6E76E0] focus:ring-2 focus:ring-[#6E76E0]/20 transition-all text-base sm:text-sm"
          />
        </QuestionCard>
      </SurveySection>

      {/* Submission Failure Alert */}
      {submissionError && (
        <div 
          className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 shadow-xs animate-shake"
          role="alert"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Submission Notice</h4>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
              {submissionError}
            </p>
          </div>
        </div>
      )}

      {/* Submit Button Section */}
      <div className="pt-4 pb-8 sm:pb-12 flex flex-col items-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[260px] min-h-[52px] inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-[#14143A] hover:bg-[#2E3180] disabled:bg-neutral-400 text-white text-base font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting Survey...</span>
            </>
          ) : (
            <>
              <span>Submit Survey</span>
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
        <p className="text-neutral-400 text-xs mt-3 text-center">
          By submitting, you help us bring better home services to your community.
        </p>
      </div>
    </form>
  );
};
