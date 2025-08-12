import { useEffect, useState } from "react";

const HomePage = () => {
  const adjectives = ["fast", "precise", "trusted", "skilled"];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % adjectives.length),
      2000
    );
    return () => clearInterval(t);
  }, [adjectives.length]);

  const [carsServed, setCarsServed] = useState(0);
  const [years, setYears] = useState(0);
  const [happy, setHappy] = useState(0);

  useEffect(() => {
    let a = 0,
      b = 0,
      c = 0;
    const ia = setInterval(() => {
      a += 5;
      if (a >= 1250) a = 1250;
      setCarsServed(a);
    }, 12);

    const ib = setInterval(() => {
      b += 1;
      if (b >= 12) b = 12;
      setYears(b);
    }, 180);

    const ic = setInterval(() => {
      c += 2;
      if (c >= 98) c = 98;
      setHappy(c);
    }, 18);

    return () => {
      clearInterval(ia);
      clearInterval(ib);
      clearInterval(ic);
    };
  }, []);

  const features = [
    {
      title: "Express Diagnostics",
      desc: "Same-day inspections with prioritized repair lanes to get you back on the road quickly.",
      emoji: "⚡",
    },
    {
      title: "Expert Team",
      desc: "Certified technicians, electrical specialists and seasoned service managers working in sync.",
      emoji: "👩‍🔧",
    },
    {
      title: "Full Transparency",
      desc: "Clear service history, timestamped notes and one-touch reports for every job.",
      emoji: "📋",
    },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-indigo-900 text-gray-100 overflow-hidden">
      <div className="flex items-start justify-center h-full w-full overflow-auto">
        <div className="max-w-4xl mx-auto text-center px-6 mt-20 space-y-10">
          <header className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-lg">
              CarTracker — where{" "}
              <span className="text-emerald-400">{adjectives[idx]}</span>{" "}
              maintenance
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              We blend speed with precision: a dedicated crew of mechanics and
              diagnostics experts, transparent service logs, and streamlined
              workflows so your vehicle spends less time in the shop and more
              time on the road.
            </p>

            <div className="mt-6 inline-grid grid-cols-3 gap-4 bg-white/5 p-4 rounded-3xl shadow-md border border-white/6">
              <div className="group p-2 rounded-xl">
                <div className="text-2xl font-bold text-emerald-300">
                  {carsServed}+
                </div>
                <div className="text-xs text-gray-300">Cars serviced</div>
              </div>

              <div className="group p-2 rounded-xl">
                <div className="text-2xl font-bold text-emerald-300">
                  {years}
                </div>
                <div className="text-xs text-gray-300">Years in service</div>
              </div>

              <div className="group p-2 rounded-xl">
                <div className="text-2xl font-bold text-emerald-300">
                  {happy}%
                </div>
                <div className="text-xs text-gray-300">Positive feedback</div>
              </div>
            </div>
          </header>

          <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left px-2">
            {features.map((f) => (
              <article
                key={f.title}
                className="group bg-gray-900 bg-opacity-40 backdrop-blur-md rounded-2xl p-6 shadow-lg transition transform hover:-translate-y-2 border border-gray-700"
              >
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h3 className="text-xl font-semibold text-emerald-400 mb-1">
                  {f.title}
                </h3>
                <p className="text-gray-200 text-sm">{f.desc}</p>
                <div className="mt-4 text-xs text-gray-400">
                  Fast lane available for urgent repairs
                </div>
              </article>
            ))}
          </section>

          <section className="mt-8 mb-8 bg-gradient-to-r from-white/3 to-white/2 border border-white/6 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/6 flex items-center justify-center">
                🚗
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">
                  What our customers notice first
                </div>
                <p className="text-gray-300 text-sm mt-1">
                  "Quick diagnostics, honest pricing and a crew that explains
                  every step — highly recommended."
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
