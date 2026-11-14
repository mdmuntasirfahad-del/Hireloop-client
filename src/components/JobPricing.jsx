"use client";

// components/JobPricing.jsx  (HeroUI v3 + Gravity UI icons + Tailwind)
import { useState } from "react";
import { Card } from "@heroui/react";
import { CrownDiamond, ChartColumn, Thunderbolt, Plus, ArrowRight } from "@gravity-ui/icons";
import Link from "next/link";

const YEARLY_DISCOUNT = 0.25;

const plans = [
  {
    id: "free",
    name: "Free",
    icon: CrownDiamond,
    price: 0,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    icon: ChartColumn,
    price: 19,
    featured: true,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    icon: Thunderbolt,
    price: 39,
    features: [
      "Everything in Pro",
      "Multi-profile career portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
    ],
  },
];

function formatPrice(price, yearly) {
  const value = yearly ? price * (1 - YEARLY_DISCOUNT) : price;
  return Number.isInteger(value) ? value : value.toFixed(2);
}

export default function JobPricing({ items = plans }) {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="text-center">
          <p className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-zinc-300">
            <span className="h-1.5 w-1.5 bg-indigo-500" aria-hidden />
            Pricing
            <span className="h-1.5 w-1.5 bg-indigo-500" aria-hidden />
          </p>
          <h2 className="mx-auto mt-4 max-w-md text-balance text-4xl font-medium leading-tight sm:text-5xl">
            Pay for the leverage, not the listings
          </h2>
        </div>

        {/* Billing toggle */}


        <div className="mt-10 flex justify-center">
          <div
            role="group"
            aria-label="Billing period"
            className="inline-flex items-center gap-1 rounded-full bg-zinc-900 p-1 ring-1 ring-white/10"
          >
            <button
              type="button"
              aria-pressed={!yearly}
              onClick={() => setYearly(false)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${!yearly ? "bg-white text-black" : "text-zinc-300 hover:text-white"
                }`}
            >
              Monthly
            </button>
            <button
              type="button"
              aria-pressed={yearly}
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${yearly ? "bg-white text-black" : "text-zinc-300 hover:text-white"
                }`}
            >
              Yearly
              <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <ul className="mt-12 grid items-center gap-5 lg:grid-cols-3">
          {items.map((plan) => {
            const Icon = plan.icon;
            return (
              <li key={plan.id}>
                <Card
                  className={`rounded-2xl border text-white shadow-none ${plan.featured
                      ? "border-white/15 bg-zinc-900 lg:scale-105 lg:shadow-2xl lg:shadow-black"
                      : "border-white/10 bg-black"
                    }`}
                >
                  <Card.Content className="flex flex-col gap-6 p-6">
                    {/* Name + price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 items-center justify-center rounded-md bg-zinc-800">
                          <Icon
                            width={14}
                            height={14}
                            className="text-indigo-300"
                            aria-hidden
                          />
                        </span>
                        <h3 className="text-base font-medium">{plan.name}</h3>
                      </div>
                      <p className="flex items-baseline gap-1">
                        <span className="text-3xl font-semibold">
                          ${formatPrice(plan.price, yearly)}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {yearly ? "/mo, billed yearly" : "/month"}
                        </span>
                      </p>
                    </div>

                    {/* Features */}
                    <div>
                      <p className="text-sm font-medium">
                        What&apos;s included:
                      </p>
                      <ul className="mt-4 space-y-3">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-3 text-xs text-zinc-300"
                          >
                            <span className="flex size-4 shrink-0 items-center justify-center rounded bg-zinc-800">
                              <Plus width={10} height={10} aria-hidden />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <Link href={'/plans'}
                      className={`mt-6 inline-flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-xs font-medium transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${plan.featured
                          ? "!bg-white !text-black"
                          : "!bg-zinc-800 !text-white"
                        }`}
                    >
                      Choose this plan
                      <ArrowRight width={14} height={14} aria-hidden />
                    </Link>
                  </Card.Content>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}