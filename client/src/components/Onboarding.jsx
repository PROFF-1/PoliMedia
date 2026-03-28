import { useState } from "react";

const AGE_GROUPS = [
  { id: "15-17", label: "15–17", emoji: "🎒", desc: "High School" },
  { id: "18-24", label: "18–24", emoji: "🎓", desc: "University / Early Career" },
  { id: "25-34", label: "25–34", emoji: "💼", desc: "Young Professional" },
];

const OCCUPATIONS = [
  { id: "student", label: "Student", emoji: "📚" },
  { id: "developer", label: "Developer / Tech", emoji: "💻" },
  { id: "trader", label: "Trader / Business", emoji: "🏪" },
  { id: "healthcare", label: "Healthcare", emoji: "🏥" },
  { id: "farmer", label: "Farmer / Agric", emoji: "🌾" },
];

const LOCATIONS = [
  { id: "urban", label: "Urban", emoji: "🏙️", desc: "City / Town" },
  { id: "rural", label: "Rural", emoji: "🌿", desc: "Village / Countryside" },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    ageGroup: "",
    occupation: "",
    location: "",
  });

  const steps = [
    {
      key: "ageGroup",
      title: "How old are you?",
      subtitle: "This helps us tailor policies that affect your stage of life",
      options: AGE_GROUPS,
    },
    {
      key: "occupation",
      title: "What do you do?",
      subtitle: "We'll show how policies impact your work and income",
      options: OCCUPATIONS,
    },
    {
      key: "location",
      title: "Where do you live?",
      subtitle: "Urban and rural communities face different policy effects",
      options: LOCATIONS,
    },
  ];

  const currentStep = steps[step];

  const handleSelect = (value) => {
    const newProfile = { ...profile, [currentStep.key]: value };
    setProfile(newProfile);

    if (step < steps.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => onComplete(newProfile), 400);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="mb-10 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-xl">
            ⚡
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-civic-300 bg-clip-text text-transparent">
            CivicPulse
          </h1>
        </div>
        <p className="text-civic-400 text-sm">
          Policies that matter to <span className="text-white font-medium">you</span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-8 animate-fade-in">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-500"
              style={{
                background:
                  i <= step
                    ? "linear-gradient(90deg, #3b82f6, #8b5cf6)"
                    : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>
        <p className="text-civic-500 text-xs mt-2 text-right">
          {step + 1} of {steps.length}
        </p>
      </div>

      {/* Question */}
      <div key={step} className="w-full max-w-md animate-slide-up">
        <h2 className="text-2xl font-bold text-white mb-2">
          {currentStep.title}
        </h2>
        <p className="text-civic-400 text-sm mb-6">{currentStep.subtitle}</p>

        {/* Options */}
        <div className="space-y-3">
          {currentStep.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer
                ${
                  profile[currentStep.key] === option.id
                    ? "border-accent-blue/50 bg-accent-blue/10 scale-[0.98]"
                    : "border-glass-border bg-glass-white hover:bg-glass-hover hover:border-civic-500/30 hover:scale-[1.02]"
                }
              `}
            >
              <span className="text-2xl">{option.emoji}</span>
              <div className="text-left">
                <p className="font-semibold text-white">{option.label}</p>
                {option.desc && (
                  <p className="text-xs text-civic-400">{option.desc}</p>
                )}
              </div>
              {profile[currentStep.key] === option.id && (
                <div className="ml-auto">
                  <svg className="w-5 h-5 text-accent-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Skip for now */}
      <button
        onClick={() =>
          onComplete({ ageGroup: "18-24", occupation: "student", location: "urban" })
        }
        className="mt-8 text-civic-500 text-sm hover:text-civic-300 transition-colors cursor-pointer"
      >
        Skip personalization →
      </button>
    </div>
  );
}
