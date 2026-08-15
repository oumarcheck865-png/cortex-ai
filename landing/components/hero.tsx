"use client";

import { Button } from "@/components/ui/button";
import { CortexMark } from "@/components/cortex-mark";
import {
  BrainCircuitIcon,
  CpuIcon,
  ShieldIcon,
  GlobeIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const highlights = [
  {
    icon: CpuIcon,
    label: "Bring your own model",
  },
  {
    icon: ShieldIcon,
    label: "No vendor lock-in",
  },
  {
    icon: GlobeIcon,
    label: "Self-hostable",
  },
];

export default function Hero() {
  return (
    <div className="relative justify-center items-center">
      <section className="max-w-(--breakpoint-xl) mx-auto px-4 py-28 gap-12 md:px-8 flex flex-col justify-center items-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{ duration: 0.6, type: "spring", bounce: 0 }}
          className="flex flex-col justify-center items-center space-y-5 max-w-4xl mx-auto text-center"
        >
          <span className="w-fit h-full text-sm bg-card px-3 py-1 border border-border rounded-full inline-flex items-center gap-2">
            <BrainCircuitIcon className="size-3.5" />
            Autonomous AI agent platform
          </span>
          <h1 className="text-4xl font-medium tracking-tighter mx-auto md:text-6xl text-pretty bg-linear-to-b from-indigo-700 dark:from-indigo-300 to-foreground dark:to-foreground bg-clip-text text-transparent">
            The autonomous AI platform you fully control
          </h1>
          <p className="max-w-2xl text-lg mx-auto text-muted-foreground text-balance">
            Cortex AI turns autonomous agents into a self-hosted engineering
            team. Bring your own LLM, your own GPU, and your own APIs — no
            embedded keys, no mandatory cloud, no required telemetry.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2">
            {highlights.map((h) => (
              <span
                key={h.label}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <h.icon className="size-4 text-primary" />
                {h.label}
              </span>
            ))}
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0 pt-2"
          >
            <Button asChild size="lg" className="shadow-lg">
              <Link href="/signup">
                Start building free
                <CortexMark className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Connexion</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5, type: "spring", bounce: 0 }}
        className="w-full h-full absolute -top-32 flex justify-end items-center pointer-events-none "
      >
        <div className="w-3/4 flex justify-center items-center">
          <div className="w-12 h-150 bg-light blur-[70px] rounded-3xl max-sm:rotate-15 sm:rotate-35 will-change-transform"></div>
        </div>
      </motion.div>
    </div>
  );
}
