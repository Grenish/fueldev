import { CheckCircle, XCircle } from "lucide-react";

export function ProblemsSection() {
  const problems = [
    {
      title: "High Commission Rates",
      problem: "Most platforms take 30% or more",
      solution: "FuelDev: 0% commission",
    },
    {
      title: "No Local Payment Support",
      problem: "Waiting days for international transfers",
      solution: "FuelDev: Instant UPI & Bank transfers",
    },
    {
      title: "Lack of Transparency",
      problem: "Hidden fees and unclear policies",
      solution: "FuelDev: Fully transparent",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Creators Deserve Better
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Current platforms don&apos;t serve Indian creators. FuelDev changes
            that.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((item, idx) => (
            <div
              key={idx}
              className="bg-card p-8 rounded-xl border border-border"
            >
              <div className="space-y-6">
                {/* Problem */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle size={20} className="text-destructive" />
                    <h3 className="font-bold text-lg">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground ml-7">{item.problem}</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-border"></div>

                {/* Solution */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle size={20} className="text-accent" />
                    <p className="font-semibold">{item.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
