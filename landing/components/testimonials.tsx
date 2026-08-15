"use client";

import { Button } from "@/components/ui/button";
import { StarIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useState } from "react";

type Testimonial = {
  name: string;
  role: string;
  content: string;
  rating: number;
};

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: "Alex Rivera",
      role: "Staff Engineer, FinTech",
      content:
        "Cortex AI replaced three internal tools. We run agents on our own GPUs with our own models — full control, zero vendor lock-in.",
      rating: 5,
    },
    {
      name: "Mei Lin",
      role: "Platform Lead, SaaS",
      content:
        "The conversation interface and real-time events are a step above anything else. Shipping automations from GitHub issues saved us a full hire.",
      rating: 5,
    },
    {
      name: "Omar Chek",
      role: "CTO, Startup",
      content:
        "Self-hosted by default and bring-your-own-model was exactly what we needed. No embedded keys, no telemetry we didn't ask for.",
      rating: 5,
    },
    {
      name: "Sofia Garcia",
      role: "DevOps Engineer",
      content:
        "We deployed Cortex AI in Docker on our own VMs. The terminal, file management, and MCP integrations just work.",
      rating: 5,
    },
    {
      name: "Thomas Becker",
      role: "Engineering Manager",
      content:
        "The Skills system let us codify our review process. Agents now open PRs that actually match our standards.",
      rating: 4,
    },
    {
      name: "Priya Nair",
      role: "ML Engineer",
      content:
        "Connecting our local Llama endpoint took minutes. Cortex AI is the most model-agnostic agent platform we've tried.",
      rating: 5,
    },
  ];

  const visibleCount = 3;
  const [showAll, setShowAll] = useState(false);

  return (
    <section
      id="testimonials"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12 flex flex-col gap-3 text-center"
      >
        <h2 className="text-xl font-semibold sm:text-2xl bg-linear-to-b from-foreground to-muted-foreground text-transparent bg-clip-text">
          Loved by engineering teams
        </h2>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Teams self-hosting Cortex AI report faster shipping and full control
          over their AI stack.
        </p>
      </motion.div>

      <div className="relative">
        <div className="columns-2 gap-3 space-y-3 sm:gap-8 sm:space-y-8 md:columns-2 lg:columns-3">
          {(showAll ? testimonials : testimonials.slice(0, visibleCount)).map(
            (testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                className="mb-3 break-inside-avoid sm:mb-8"
              >
                <div className="rounded-lg border border-border bg-card p-3 transition-colors duration-300 sm:rounded-xl sm:p-6">
                  <div className="mb-2 flex sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>

                  <p className="mb-4 text-xs leading-snug text-muted-foreground sm:mb-6 sm:text-sm sm:leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-linear-to-br from-primary/20 to-primary/10 text-xs font-medium sm:h-10 sm:w-10 sm:text-sm">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-xs font-semibold sm:text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="truncate text-[10px] leading-tight text-muted-foreground sm:text-xs">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ),
          )}
        </div>

        {!showAll && testimonials.length > visibleCount && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background via-background/90 to-transparent" />
        )}
      </div>

      {!showAll && testimonials.length > visibleCount && (
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" onClick={() => setShowAll(true)}>
            Voir plus
          </Button>
        </div>
      )}
    </section>
  );
}
