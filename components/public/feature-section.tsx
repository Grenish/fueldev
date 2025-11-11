import { Zap, Users, Shield, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Instant Earnings",
      description:
        "Your work deserves instant reward. Receive payments directly, fast and effortless.",
      accent: "01",
    },
    {
      icon: Users,
      title: "Closer to Your Supporters",
      description:
        "A platform designed to strengthen connection and trust between you and your audience.",
      accent: "02",
    },
    {
      icon: Shield,
      title: "Transparent by Design",
      description:
        "Every contribution is visible and traceable. No hidden fees, no fine print.",
      accent: "03",
    },
    {
      icon: TrendingUp,
      title: "Insights that Matter",
      description:
        "Understand your audience deeply and grow with data-driven clarity.",
      accent: "04",
    },
  ];

  return (
    <section id="features" className="container py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with creative layout */}
        <div className="grid lg:grid-cols-2 gap-8 items-end mb-16">
          <div>
            <span className="inline-block text-sm font-medium text-primary mb-4">
              Features
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need
              <br />
              <span className="text-muted-foreground">to succeed</span>
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-muted-foreground lg:text-right">
              Built specifically for Indian creators to monetize their content
              effortlessly
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="relative group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-muted"
              >
                {/* Accent Number */}
                <span className="absolute -top-3 -right-3 text-5xl font-bold text-muted-foreground/10 select-none pointer-events-none">
                  {feature.accent}
                </span>

                <CardHeader className="space-y-4 pb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-lg leading-none tracking-tight">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            );
          })}
        </div>

        {/* Optional: Creative bottom element */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-px w-16 bg-border" />
            <span>Trusted by 10,000+ creators & developers</span>
            <div className="h-px w-16 bg-border" />
          </div>
        </div>
      </div>
    </section>
  );
}
