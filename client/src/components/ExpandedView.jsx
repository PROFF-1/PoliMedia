import { useState, useEffect, useRef } from "react";

export default function ExpandedView({ policy, userProfile, onClose }) {
  const [aiExplanation, setAiExplanation] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const backdropRef = useRef(null);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  const fetchAiExplanation = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyTitle: policy.title,
          policySummary: policy.summary,
          occupation: userProfile.occupation,
          ageGroup: userProfile.ageGroup,
          location: userProfile.location,
        }),
      });
      const data = await res.json();
      setAiExplanation(data.explanation);
    } catch (err) {
      console.error("AI explanation failed:", err);
      setAiExplanation(
        "Unable to generate AI explanation right now. Check the deep dive below for more context."
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center animate-backdrop"
    >
      <div className="w-full max-w-lg bg-civic-800 rounded-t-3xl max-h-[90vh] overflow-y-auto animate-modal">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-civic-800 rounded-t-3xl z-10">
          <div className="w-10 h-1 bg-civic-600 rounded-full" />
        </div>

        <div className="px-5 pb-8">
          {/* Close button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="text-civic-500 hover:text-white transition-colors text-sm cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2 leading-snug">
            {policy.title}
          </h2>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-civic-400">
              📅 {new Date(policy.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="text-xs text-civic-500">•</span>
            <a
              href={policy.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent-blue hover:underline"
            >
              🔗 {policy.sourceName}
            </a>
          </div>

          {/* Summary */}
          <p className="text-civic-300 text-sm leading-relaxed mb-5">
            {policy.summary}
          </p>

          {/* Personal impact */}
          <div className="rounded-xl bg-accent-blue/10 border border-accent-blue/20 p-4 mb-5">
            <h4 className="text-sm font-semibold text-accent-blue mb-2 flex items-center gap-2">
              👤 How this affects you
            </h4>
            <p className="text-sm text-civic-200 leading-relaxed">
              {policy.personalImpact}
            </p>
            {policy.locationImpact && (
              <p className="text-sm text-civic-300 leading-relaxed mt-2 pt-2 border-t border-accent-blue/10">
                📍 {policy.locationImpact}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {policy.tags.map((tag, i) => {
              const colors = {
                up: { bg: "rgba(239,68,68,0.1)", text: "#ef4444", icon: "↑" },
                down: { bg: "rgba(16,185,129,0.1)", text: "#10b981", icon: "↓" },
                neutral: { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", icon: "→" },
              };
              const c = colors[tag.direction] || colors.neutral;
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{ background: c.bg, color: c.text }}
                >
                  {tag.label} {c.icon}
                </span>
              );
            })}
          </div>

          {/* Deep explanation */}
          <div className="rounded-xl bg-glass-white border border-glass-border p-4 mb-5">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              🔍 Deep Dive
            </h4>
            <p className="text-sm text-civic-300 leading-relaxed">
              {policy.deepExplanation}
            </p>
          </div>

          {/* AI explanation */}
          <div className="rounded-xl bg-accent-purple/8 border border-accent-purple/15 p-4">
            <h4 className="text-sm font-semibold text-accent-purple mb-2 flex items-center gap-2">
              🤖 AI Explanation
            </h4>

            {aiExplanation ? (
              <p className="text-sm text-civic-200 leading-relaxed animate-fade-in">
                {aiExplanation}
              </p>
            ) : loadingAi ? (
              <div className="space-y-2">
                <div className="h-3 w-full rounded shimmer" />
                <div className="h-3 w-4/5 rounded shimmer" />
                <div className="h-3 w-3/4 rounded shimmer" />
              </div>
            ) : (
              <button
                onClick={fetchAiExplanation}
                className="w-full py-2.5 rounded-xl bg-accent-purple/20 text-accent-purple text-sm font-medium hover:bg-accent-purple/30 transition-all duration-200 cursor-pointer"
              >
                ✨ Explain this to me like I&apos;m {userProfile.ageGroup === "15-17" ? "in high school" : "a " + userProfile.occupation}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
