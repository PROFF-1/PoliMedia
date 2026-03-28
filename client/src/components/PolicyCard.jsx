const CATEGORY_COLORS = {
  transport: { bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.2)", text: "#f59e0b", icon: "🚗" },
  finance: { bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.2)", text: "#10b981", icon: "💰" },
  education: { bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.2)", text: "#3b82f6", icon: "📖" },
  housing: { bg: "rgba(139, 92, 246, 0.1)", border: "rgba(139, 92, 246, 0.2)", text: "#8b5cf6", icon: "🏠" },
  health: { bg: "rgba(236, 72, 153, 0.1)", border: "rgba(236, 72, 153, 0.2)", text: "#ec4899", icon: "💊" },
  technology: { bg: "rgba(6, 182, 212, 0.1)", border: "rgba(6, 182, 212, 0.2)", text: "#06b6d4", icon: "📱" },
};

const TAG_DIRECTIONS = {
  up: { icon: "↑", color: "#ef4444" },
  down: { icon: "↓", color: "#10b981" },
  neutral: { icon: "→", color: "#f59e0b" },
};

export default function PolicyCard({ policy, index, onClick }) {
  const category = CATEGORY_COLORS[policy.category] || CATEGORY_COLORS.transport;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  return (
    <article
      onClick={onClick}
      className="animate-slide-up rounded-2xl border border-glass-border bg-glass-white backdrop-blur-sm p-5 cursor-pointer transition-all duration-300 hover:bg-glass-hover hover:border-civic-600/40 hover:scale-[1.01] active:scale-[0.99]"
      style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
    >
      {/* Top row: category + date */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            background: category.bg,
            border: `1px solid ${category.border}`,
            color: category.text,
          }}
        >
          <span>{category.icon}</span>
          {policy.category.charAt(0).toUpperCase() + policy.category.slice(1)}
        </div>
        <span className="text-civic-500 text-xs">{formatDate(policy.date)}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-2 leading-snug">
        {policy.title}
      </h3>

      {/* Summary */}
      <p className="text-civic-400 text-sm leading-relaxed mb-3">
        {policy.summary}
      </p>

      {/* Personal impact banner */}
      {policy.personalImpact && (
        <div className="rounded-xl bg-accent-blue/8 border border-accent-blue/15 p-3 mb-3">
          <div className="flex items-start gap-2">
            <span className="text-sm mt-0.5">👤</span>
            <div>
              <p className="text-xs font-semibold text-accent-blue mb-0.5">
                How this affects you
              </p>
              <p className="text-sm text-civic-300 leading-relaxed">
                {policy.personalImpact}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {policy.tags.map((tag, i) => {
            const dir = TAG_DIRECTIONS[tag.direction] || TAG_DIRECTIONS.neutral;
            return (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md"
                style={{
                  background: `${dir.color}15`,
                  color: dir.color,
                }}
              >
                {tag.label} {dir.icon}
              </span>
            );
          })}
        </div>
        <span className="text-civic-500 text-xs hover:text-civic-300 transition-colors">
          Read more →
        </span>
      </div>
    </article>
  );
}
