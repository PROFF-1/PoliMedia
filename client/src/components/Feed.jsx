import { useState, useEffect } from "react";
import PolicyCard from "./PolicyCard";
import ExpandedView from "./ExpandedView";

const CATEGORY_FILTERS = [
  { id: "all", label: "All", emoji: "🔥" },
  { id: "transport", label: "Transport", emoji: "🚗" },
  { id: "finance", label: "Finance", emoji: "💰" },
  { id: "education", label: "Education", emoji: "📖" },
  { id: "housing", label: "Housing", emoji: "🏠" },
  { id: "health", label: "Health", emoji: "💊" },
  { id: "technology", label: "Tech", emoji: "📱" },
];

export default function Feed({ userProfile, onResetProfile }) {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchPolicies();
  }, [userProfile]);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/policies?occupation=${userProfile.occupation}&location=${userProfile.location}`
      );
      const data = await res.json();
      setPolicies(data);
    } catch (err) {
      console.error("Failed to fetch policies:", err);
      // Fallback: use client-side mock data
      const { default: mockPolicies } = await import("../data/policies.js");
      setPolicies(
        mockPolicies.map((p) => ({
          ...p,
          personalImpact:
            p.impacts[userProfile.occupation] || p.impacts.default,
          locationImpact: p.impactsByLocation[userProfile.location] || "",
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredPolicies =
    activeFilter === "all"
      ? policies
      : policies.filter((p) => p.category === activeFilter);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-civic-900/80 border-b border-glass-border">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-sm">
                ⚡
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-civic-300 bg-clip-text text-transparent">
                CivicPulse
              </span>
            </div>
            <button
              onClick={onResetProfile}
              className="text-xs text-civic-500 hover:text-civic-300 transition-colors border border-glass-border rounded-full px-3 py-1 cursor-pointer"
            >
              👤 {userProfile.occupation}
            </button>
          </div>
          <p className="text-civic-400 text-xs">
            {getGreeting()} — here&apos;s what affects you today
          </p>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-none">
          {CATEGORY_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer
                ${
                  activeFilter === filter.id
                    ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/30"
                    : "bg-glass-white text-civic-400 border border-glass-border hover:bg-glass-hover"
                }
              `}
            >
              <span>{filter.emoji}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      {/* Feed content */}
      <main className="px-4 py-4 space-y-4 pb-20">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-glass-border p-5 space-y-3"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="h-4 w-3/4 rounded-lg shimmer" />
              <div className="h-3 w-full rounded-lg shimmer" />
              <div className="h-3 w-2/3 rounded-lg shimmer" />
              <div className="h-12 w-full rounded-xl shimmer mt-3" />
            </div>
          ))
        ) : filteredPolicies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-civic-400">No policies in this category yet</p>
          </div>
        ) : (
          filteredPolicies.map((policy, index) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              index={index}
              onClick={() => setSelectedPolicy(policy)}
            />
          ))
        )}
      </main>

      {/* Expanded view modal */}
      {selectedPolicy && (
        <ExpandedView
          policy={selectedPolicy}
          userProfile={userProfile}
          onClose={() => setSelectedPolicy(null)}
        />
      )}
    </div>
  );
}
