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
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/register">Sign Up</Link>
          </Button>
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
            <Button variant="ghost" size="sm" fullWidth asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button size="sm" fullWidth asChild>
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
