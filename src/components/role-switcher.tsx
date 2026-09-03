"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, ChevronDown, LayoutDashboard } from "lucide-react";
import { useRoles } from "@/hooks/useRoles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui";

export function RoleSwitcher() {
  const { isAdmin, isLoading } = useRoles();
  const router = useRouter();

  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-medium">Admin</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link
            href="/admin"
            className="flex items-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            Admin Dashboard
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
