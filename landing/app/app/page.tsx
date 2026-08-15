"use client";

import { Button } from "@/components/ui/button";
import { CortexMark } from "@/components/cortex-mark";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import {
  BrainCircuitIcon,
  MessageSquareIcon,
  TerminalIcon,
  WorkflowIcon,
  PlugIcon,
  FilesIcon,
  CpuIcon,
  LogOut,
} from "lucide-react";

const modules = [
  { icon: MessageSquareIcon, label: "Conversations" },
  { icon: BrainCircuitIcon, label: "Autonomous agents" },
  { icon: TerminalIcon, label: "Terminal & code" },
  { icon: FilesIcon, label: "File management" },
  { icon: WorkflowIcon, label: "Workflows" },
  { icon: PlugIcon, label: "MCP & Skills" },
  { icon: CpuIcon, label: "Model settings" },
];

export default function AppEntryPage() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  // Protect the route — bounce to login if not authenticated.
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <CortexMark className="size-8 animate-pulse" />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-12">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CortexMark className="size-7" />
          <span className="text-lg font-semibold tracking-tight">Cortex AI</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            signOut();
            router.replace("/login");
          }}
        >
          <LogOut className="mr-1 h-4 w-4" />
          Déconnexion
        </Button>
      </header>

      <section className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Bienvenue, {user.name} 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          Vous êtes dans l&apos;application Cortex AI. La plateforme intégrera
          l&apos;interface conversationnelle, les agents autonomes, le terminal,
          la gestion des fichiers, MCP, Skills, les workflows et les paramètres.
        </p>
      </section>

      <section className="mb-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {modules.map((m) => (
            <div
              key={m.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center"
            >
              <m.icon className="size-5 text-primary" />
              <span className="text-xs sm:text-sm text-muted-foreground">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/app/conversations">Lancer une conversation</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/app/settings">Paramètres &amp; configuration</Link>
        </Button>
      </section>

      <footer className="mt-auto pt-12 text-sm text-muted-foreground">
        Cortex AI — autonomous AI agent platform. Built on the OpenHands runtime.
      </footer>
    </main>
  );
}
