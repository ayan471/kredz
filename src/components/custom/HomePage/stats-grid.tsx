export function StatsGrid() {
  const stats = [
    { value: "4.9★", label: "Customer rating" },
    { value: "250k+", label: "Approved loans" },
    { value: "24–48h", label: "Avg. funding time" },
    { value: "99.99%", label: "Uptime" },
  ];

  return (
    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group relative rounded-xl border border-slate-200 bg-white p-4 sm:p-5 transition-all hover:-translate-y-1 hover:shadow-md hover:border-blue-400/40 overflow-hidden"
        >
          <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-slate-400/10 to-transparent skew-x-[-15deg] translate-x-[-30%] group-hover:translate-x-[220%] transition-transform duration-700" />
          <div className="text-2xl font-semibold tracking-tight text-slate-900">
            {stat.value}
          </div>
          <div className="text-sm text-slate-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
