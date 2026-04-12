"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconBrandTabler,
  IconLogout,
  IconSun,
  IconBulb,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import ThemeToggle from "./ToggleTheme";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type Idea = {
  _id: string;
  title: string;
};

type SidebarLinkType = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const fetchTitles = async () => {
  try {
    const response = await axios.get("/api/fetch-all-titles");
    if (response.data.success) {
      return response.data.ideas;
    }
  } catch (error) {
    console.error("Failed to fetch idea titles:", error);
  }
}

export function SidebarDemo({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  
  const {
    data : ideas = [],
    isLoading,
    isError
  } = useQuery({
    queryKey : ['ideas'],
    queryFn : fetchTitles,
    staleTime: 1000 * 60 * 5
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const staticLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const ideaLinks : SidebarLinkType[] = ideas.map((idea: Idea) => ({
    label: idea.title,
    href: `/idea/${idea._id}`,
    icon: (
      <IconBulb className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  }));

  const handleLogout = () => {
    signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}

            {/* Static Links */}
            <div className="mt-8 flex flex-col gap-2">
              {staticLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>

            {/* Ideas Section */}
            {ideaLinks.length > 0 && (
              <div className="mt-6 flex flex-col gap-1">
                {open && (
                  <p className="px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    My Ideas
                  </p>
                )}
                {ideaLinks.map((link, idx) => (
                  <SidebarLink
                    key={idx}
                    link={link}
                    className="truncate"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-neutral-700 px-3 py-4">
            {/* Theme Toggle */}
            <div className="mb-4">
              {open ? (
                <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-neutral-800">
                      <IconSun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Theme
                    </span>
                  </div>
                  <ThemeToggle />
                </div>
              ) : (
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center w-full rounded-lg px-3 py-2.5 text-sm cursor-pointer font-medium transition-all",
                "text-red-600 hover:bg-red-50 hover:text-red-700",
                "dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300",
                open ? "justify-start gap-3" : "justify-center",
              )}
            >
              <IconLogout className="h-5 w-5 shrink-0" />
              {open && <span>Sign Out</span>}
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-neutral-50 via-neutral-50 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {children}
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src="/VentureMind.png"
        alt="logo"
        width={32}
        height={32}
        className="shrink-0 rounded-md"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        VentureMind-AI
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/dashboard"
      className="relative z-20 flex items-center justify-center py-1"
    >
      <Image
        src="/VentureMind.png"
        alt="logo"
        width={32}
        height={32}
        className="shrink-0 rounded-md"
      />
    </Link>
  );
};