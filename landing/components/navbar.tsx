"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeSwitcher from "@/components/theme-switcher";
import { CortexMark } from "@/components/cortex-mark";
import {
  ChevronDownIcon,
  GlobeIcon,
  TimerIcon,
  HamburgerMenuIcon,
  Cross1Icon,
  ExitIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";
import { BrainIcon, CpuIcon, ShieldIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menuItems = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
  ];

  const showNavbarBlur = isScrolled || isMenuOpen;

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-[background-color,backdrop-filter] duration-300 ease-out ${
        showNavbarBlur
          ? "backdrop-blur supports-backdrop-filter:bg-background/60"
          : "backdrop-blur-0 supports-backdrop-filter:bg-background/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isMenuOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
              </motion.div>
            </Button>
          </div>
          <div className="flex sm:hidden items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <CortexMark className="size-6" />
              <span className="font-medium tracking-tighter text-lg">
                Cortex AI
              </span>
            </Link>
          </div>
          <div className="hidden sm:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center gap-2 font-medium tracking-tighter text-xl"
            >
              <CortexMark className="size-6" />
              <span>Cortex AI</span>
            </Link>

            <Button asChild variant="ghost" size="sm">
              <Link href="#features">Features</Link>
            </Button>

            <Button asChild variant="ghost" size="sm">
              <Link href="#pricing">Pricing</Link>
            </Button>

            <Button asChild variant="ghost" size="sm">
              <Link href="#testimonials">Testimonials</Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Platform
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <DropdownMenuItem>
                  <BrainIcon className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-semibold">Autonomous Agents</div>
                    <div className="text-sm text-muted-foreground">
                      Cortex AI agents plan, execute, and verify complex software
                      tasks end-to-end.
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CpuIcon className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-semibold">Bring Your Own Model</div>
                    <div className="text-sm text-muted-foreground">
                      Connect your own LLM, your own GPU resources, and your own
                      APIs. No vendor lock-in.
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <GlobeIcon className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-semibold">Self-Hostable</div>
                    <div className="text-sm text-muted-foreground">
                      Run Cortex AI locally, in Docker, on VMs, or inside your
                      own infrastructure.
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShieldIcon className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-semibold">Independent &amp; Secure</div>
                    <div className="text-sm text-muted-foreground">
                      No embedded API keys, no mandatory cloud, no required
                      telemetry. You stay in control.
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TimerIcon className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-semibold">Automations &amp; Workflows</div>
                    <div className="text-sm text-muted-foreground">
                      Schedule agents or trigger them from Slack, GitHub, Linear,
                      and webhooks.
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
              <Link href="/login">
                <ExitIcon className="mr-1 h-4 w-4" />
                Connexion
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">
                Inscription
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <ThemeSwitcher />
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="sm:hidden overflow-hidden"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="px-2 pt-2 pb-3 space-y-1"
              >
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="flex flex-col gap-2 pt-2"
                >
                  <Button asChild variant="outline" size="sm">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      Connexion
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      Inscription
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
