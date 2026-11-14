import { useState, useRef, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProgressBar } from './components/ProgressBar';
import { SurveyForm } from './components/SurveyForm';
import { SuccessScreen } from './components/SuccessScreen';
import { MobileBottomBar } from './components/MobileBottomBar';
import { AdminDashboard } from './components/AdminDashboard';
import { SurveyFormData, CRITERIA_LIST } from './types/survey';

const INITIAL_FORM_DATA: SurveyFormData = {
  name: '',
  age: '',
  location: '',
  occupation: '',
  currently_uses_services: '',
  required_services: [],
  other_service: '',
  service_frequency: '',
  provider_discovery_methods: [],
  other_discovery_method: '',
  interested_in_online_platform: '',
  booking_challenges: [],
  service_provider_criteria: {},
  would_use_onit: '',
  referral_name: '',
  _website_url_hp: '',
};

const TOTAL_QUESTIONS = 13;

const isCheckAdminRoute = () => {
  return (
    window.location.pathname.startsWith('/admin') ||
    window.location.hash.toLowerCase().includes('admin')
  );
};

function App() {
  const [currentRoute, setCurrentRoute] = useState<'survey' | 'admin'>(() => {
    return isCheckAdminRoute() ? 'admin' : 'survey';
  });

  const [formData, setFormData] = useState<SurveyFormData>(INITIAL_FORM_DATA);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmittingFromBar, setIsSubmittingFromBar] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Synchronize route with browser URL history and hash changes
  useEffect(() => {
    const handleRouteSync = () => {
      setCurrentRoute(isCheckAdminRoute() ? 'admin' : 'survey');
    };

    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setCurrentRoute('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSurvey = () => {
    window.history.pushState({}, '', '/');
    setCurrentRoute('survey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compute number of completed questions
  const completedCount = useMemo(() => {
    let count = 0;
    // Q1
    if (formData.name.trim().length > 0) count++;
    // Q2 (optional, count if provided and valid)
    if (formData.age.trim().length > 0) {
      const ageNum = Number(formData.age);
      if (!isNaN(ageNum) && ageNum >= 13 && ageNum <= 100) count++;
    }
    // Q3 (optional, count if provided)
    if (formData.location.trim().length > 0) count++;
    // Q4
    if (formData.occupation.trim().length > 0) count++;
    // Q5
    if (formData.currently_uses_services) count++;
    // Q6
    if (
      formData.required_services.length > 0 &&
      (!formData.required_services.includes('Other') || formData.other_service.trim().length > 0)
    ) {
      count++;
    }
    // Q7
    if (formData.service_frequency) count++;
    // Q8
    if (
      formData.provider_discovery_methods.length > 0 &&
      (!formData.provider_discovery_methods.includes('Other') ||
        formData.other_discovery_method.trim().length > 0)
    ) {
      count++;
    }
    // Q9
    if (formData.interested_in_online_platform) count++;
    // Q10
    if (formData.booking_challenges.length > 0) count++;
    // Q11 (service criteria)
    const criteriaCount = Object.keys(formData.service_provider_criteria).length;
    if (criteriaCount === CRITERIA_LIST.length) count++;
    // Q12
    if (formData.would_use_onit) count++;
    // Q13
    if (formData.referral_name.trim().length > 0) count++;

    return count;
  }, [formData]);

  // Compute completed sections for progress badges
  const completedSections = useMemo(() => {
    const list: number[] = [];

    // Section 1: Q1 and Q4 required
    if (formData.name.trim().length > 0 && formData.occupation.trim().length > 0) {
      list.push(1);
    }
    // Section 2: Q5, Q6, Q7 required
    if (
      formData.currently_uses_services &&
      formData.required_services.length > 0 &&
      (!formData.required_services.includes('Other') || formData.other_service.trim().length > 0) &&
      formData.service_frequency
    ) {
      list.push(2);
    }
    // Section 3: Q8, Q9 required
    if (
      formData.provider_discovery_methods.length > 0 &&
      (!formData.provider_discovery_methods.includes('Other') ||
        formData.other_discovery_method.trim().length > 0) &&
      formData.interested_in_online_platform
    ) {
      list.push(3);
    }
    // Section 4: Q10 required
    if (formData.booking_challenges.length > 0) {
      list.push(4);
    }
    // Section 5: Q11 all 7 criteria required
    if (Object.keys(formData.service_provider_criteria).length === CRITERIA_LIST.length) {
      list.push(5);
    }
    // Section 6: Q12, Q13 required
    if (formData.would_use_onit && formData.referral_name.trim().length > 0) {
      list.push(6);
    }

    return list;
  }, [formData]);

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    return completedSections.length === 6;
  }, [completedSections]);

  const scrollToSurvey = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const surveyEl = document.getElementById('survey-container');
      if (surveyEl) {
        surveyEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Scroll to next unanswered question
  const scrollToNextUnanswered = () => {
    const questions = [
      { id: 'question-name', isFilled: Boolean(formData.name.trim()) },
      { id: 'question-occupation', isFilled: Boolean(formData.occupation.trim()) },
      { id: 'question-currently_uses_services', isFilled: Boolean(formData.currently_uses_services) },
      { 
        id: 'question-required_services', 
        isFilled: formData.required_services.length > 0 && 
          (!formData.required_services.includes('Other') || Boolean(formData.other_service.trim()))
      },
      { id: 'question-service_frequency', isFilled: Boolean(formData.service_frequency) },
      { 
        id: 'question-provider_discovery_methods', 
        isFilled: formData.provider_discovery_methods.length > 0 && 
          (!formData.provider_discovery_methods.includes('Other') || Boolean(formData.other_discovery_method.trim()))
      },
      { id: 'question-interested_in_online_platform', isFilled: Boolean(formData.interested_in_online_platform) },
      { id: 'question-booking_challenges', isFilled: formData.booking_challenges.length > 0 },
      { 
        id: 'question-service_provider_criteria', 
        isFilled: Object.keys(formData.service_provider_criteria).length === CRITERIA_LIST.length 
      },
      { id: 'question-would_use_onit', isFilled: Boolean(formData.would_use_onit) },
      { id: 'question-referral_name', isFilled: Boolean(formData.referral_name.trim()) },
    ];

    const nextUnanswered = questions.find((q) => !q.isFilled);
    if (nextUnanswered) {
      const el = document.getElementById(nextUnanswered.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const handleSubmitFromMobileBar = () => {
    if (formRef.current) {
      setIsSubmittingFromBar(true);
      formRef.current.requestSubmit();
      setTimeout(() => setIsSubmittingFromBar(false), 1000);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If currently on /admin route, render the Admin Dashboard
  if (currentRoute === 'admin') {
    return <AdminDashboard onBackToSurvey={navigateToSurvey} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-neutral-900 font-sans selection:bg-[#6E76E0]/20 selection:text-[#14143A]">
      <Header onOpenAdmin={navigateToAdmin} />

      <main className="flex-1">
        {isSubmitted ? (
          <SuccessScreen onReset={handleReset} />
        ) : (
          <>
            <Hero
              onStartSurvey={scrollToSurvey}
              completedCount={completedCount}
              totalQuestions={TOTAL_QUESTIONS}
            />

            <ProgressBar
              completedCount={completedCount}
              totalQuestions={TOTAL_QUESTIONS}
              completedSections={completedSections}
            />

            <div id="survey-container" className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
              <SurveyForm
                formData={formData}
                setFormData={setFormData}
                onSubmissionSuccess={() => setIsSubmitted(true)}
                formRef={formRef}
              />
            </div>

            {/* Mobile Bottom Quick Action Bar */}
            <MobileBottomBar
              completedCount={completedCount}
              totalQuestions={TOTAL_QUESTIONS}
              isFormValid={isFormValid}
              onNextUnanswered={scrollToNextUnanswered}
              onSubmit={handleSubmitFromMobileBar}
              isSubmitting={isSubmittingFromBar}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200/80 bg-white py-8 px-4 sm:px-6 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2.5">
            <img src="/onit-logo.svg" alt="ONIT" className="h-6 w-auto" />
            <span>&copy; {new Date().getFullYear()} ONIT Services. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <button
              type="button"
              onClick={navigateToAdmin}
              className="text-[#6E76E0] hover:text-[#14143A] font-bold transition-colors cursor-pointer"
            >
              /admin (Analytics & Responses)
            </button>
            <span className="text-neutral-300">&bull;</span>
            <a
              href="https://www.onitservices.in/home"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#14143A] transition-colors"
            >
              Official Website
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
