'use client';

export default function TrustBadges() {
  const badges = [
    { icon: "✓", text: "Updated Daily", color: "from-green-500 to-emerald-500" },
    { icon: "🔒", text: "100% Free", color: "from-blue-500 to-cyan-500" },
    { icon: "⚡", text: "Instant Access", color: "from-violet-500 to-purple-500" },
    { icon: "🎯", text: "Verified Tools", color: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-violet-500/30 transition-colors"
        >
          <span className="text-2xl">{badge.icon}</span>
          <span className="text-sm font-semibold text-slate-300">{badge.text}</span>
        </div>
      ))}
    </div>
  );
}
