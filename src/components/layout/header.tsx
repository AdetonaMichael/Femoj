"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE_CONFIG, NAVIGATION } from "@/constants";
import { Button } from "@/components/ui";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { logo1 } from "../../../public";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-center flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
           <Image src={logo1} alt="Femoj" width={42} height={42} />
          <span>{SITE_CONFIG.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAVIGATION.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <a href="/auth/login" className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap hover:bg-muted active:bg-muted/80 text-foreground px-3 py-1.5 text-sm h-9 text-[#1a73e8]">
            Sign In
          </a>
          <a href="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap bg-primary text-white hover:bg-primary/90 active:bg-primary/80 px-3 py-1.5 text-sm h-9">
            Sign Up
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border p-4 space-y-2">
          {NAVIGATION.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-border mt-2">
            <a href="/auth/login" className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap hover:bg-muted active:bg-muted/80 text-foreground px-3 py-1.5 text-sm h-9 text-[#1a73e8] w-full">
              Sign In
            </a>
            <a href="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap bg-primary text-white hover:bg-primary/90 active:bg-primary/80 px-3 py-1.5 text-sm h-9 w-full">
              Sign Up
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
