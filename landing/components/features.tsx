"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BrainCircuitIcon,
  TerminalIcon,
  FilesIcon,
  WorkflowIcon,
  PlugIcon,
  CpuIcon,
  ShieldIcon,
  WebhookIcon,
  MessageSquareIcon,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuitIcon,
    title: "Conversational AI interface",
    desc: "Chat with autonomous agents that plan, reason, and execute complex software tasks end-to-end.",
  },
  {
    icon: MessageSquareIcon,
    title: "Conversation & history",
    desc: "Full conversation management with persistent history, search, and shared conversations.",
  },
  {
    icon: TerminalIcon,
    title: "Terminal & code execution",
    desc: "Run commands, execute code, and preview results in real time — fully sandboxed.",
  },
  {
    icon: FilesIcon,
    title: "File management",
    desc: "Browse, edit, and manage workspace files with a built-in editor and diff preview.",
  },
  {
    icon: WorkflowIcon,
    title: "Workflows & automations",
    desc: "Schedule agents or trigger them from Slack, GitHub, Linear, and webhook events.",
  },
  {
    icon: PlugIcon,
    title: "MCP & Skills",
    desc: "Connect Model Context Protocol servers and extend agents with reusable Skills.",
  },
  {
    icon: CpuIcon,
    title: "Bring your own model",
    desc: "Use any LLM — your own provider, a local model, or any OpenAI-compatible endpoint.",
  },
  {
    icon: ShieldIcon,
    title: "Independent & secure",
    desc: "No embedded API keys, no mandatory cloud, no required telemetry. You own your data.",
  },
  {
    icon: WebhookIcon,
    title: "Real-time WebSocket events",
    desc: "Stream agent actions, observations, and system events live as they happen.",
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12 flex flex-col gap-3 text-center"
      >
        <h2 className="text-2xl font-semibold sm:text-4xl bg-linear-to-b from-foreground to-muted-foreground text-transparent bg-clip-text">
          Everything you need to run autonomous agents
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Cortex AI ships the full OpenHands runtime — rebranded and ready for
          your own models and infrastructure.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, index) => (
          <motion.div
            key={f.title}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card className="h-full rounded-2xl border border-border hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="mb-2 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {f.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Button asChild size="lg">
          <Link href="#pricing">Explore the platform</Link>
        </Button>
      </div>
    </section>
  );
}
