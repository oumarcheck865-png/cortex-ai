"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function Faq() {
  const accordionItems = [
    {
      title: "Do I need a cloud account to use Cortex AI?",
      content: (
        <div className="text-muted-foreground">
          No. Cortex AI is self-hostable by default and has no mandatory cloud
          dependency. You can run it locally, in Docker, on a VM, or inside your
          own infrastructure.
        </div>
      ),
    },
    {
      title: "Can I use my own LLM?",
      content: (
        <div className="text-muted-foreground">
          Yes. Cortex AI is model-agnostic. Connect any LLM provider, a local
          model, or any OpenAI-compatible endpoint. There are no embedded API
          keys — you configure your own.
        </div>
      ),
    },
    {
      title: "Can I connect my own GPU resources?",
      content: (
        <div className="text-muted-foreground">
          Yes. Point Cortex AI at your own servers and GPU resources. The
          architecture is designed so you bring your own compute, your own
          models, and your own APIs.
        </div>
      ),
    },
    {
      title: "Is there telemetry or tracking?",
      content: (
        <div className="text-muted-foreground">
          Cortex AI has no required telemetry. Any analytics are opt-in and can
          be fully disabled. You stay in control of your data.
        </div>
      ),
    },
    {
      title: "What is included from OpenHands?",
      content: (
        <div className="text-muted-foreground">
          Cortex AI integrates the full OpenHands runtime: conversational AI,
          conversation history, autonomous agents, terminal, code execution,
          file management, MCP, Skills, workflows, real-time WebSocket events,
          and settings.
        </div>
      ),
    },
  ];

  return (
    <motion.section
      id="faq"
      initial={{ y: 20, opacity: 0 }}
      whileInView={{
        y: 0,
        opacity: 1,
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.5, type: "spring", bounce: 0 }}
      className="relative w-full max-w-(--breakpoint-xl) mx-auto px-4 py-28 gap-5 md:px-8 flex flex-col justify-center items-center"
    >
      <div className="flex flex-col gap-3 justify-center items-center">
        <h4 className="text-2xl font-bold sm:text-3xl bg-linear-to-b from-foreground to-muted-foreground text-transparent bg-clip-text">
          FAQ
        </h4>
        <p className="max-w-xl text-muted-foreground text-center">
          Frequently asked questions about Cortex AI.
        </p>
      </div>
      <div className="flex w-full max-w-lg">
        <Accordion type="multiple" className="w-full">
          {accordionItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="text-muted-foreground"
            >
              <AccordionTrigger className="text-left">
                {item.title}
              </AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.section>
  );
}
