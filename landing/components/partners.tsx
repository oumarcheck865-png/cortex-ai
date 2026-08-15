"use client";

import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Compatible technologies / integrations Cortex AI works with.
 * Uses simple inline SVG/emoji marks to avoid external icon dependencies.
 */
export default function Partners() {
  const integrations = [
    "OpenAI",
    "Anthropic",
    "Mistral",
    "Llama",
    "Docker",
    "GitHub",
    "Slack",
    "Linear",
    "Notion",
    "Kubernetes",
  ];

  return (
    <section className="py-12 px-4 border-y bg-card/40">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-sm text-muted-foreground mb-6"
        >
          Works with the models, runtimes, and tools you already use
        </motion.p>
        <TooltipProvider delayDuration={100}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
          >
            {integrations.map((name) => (
              <Tooltip key={name}>
                <TooltipTrigger asChild>
                  <span className="text-base sm:text-lg font-medium tracking-tight text-muted-foreground/80 hover:text-foreground transition-colors cursor-default">
                    {name}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{name} compatible</TooltipContent>
              </Tooltip>
            ))}
          </motion.div>
        </TooltipProvider>
      </div>
    </section>
  );
}
