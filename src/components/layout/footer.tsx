"use client";

import Link from "next/link";
import { Twitter, Linkedin, MessageCircle } from "lucide-react";
import Image from "next/image";
import { logo1 } from "../../../public";

const FOOTER_COLS = [
  { title: "Products", links: ["Virtual Numbers", "SMS Inbox", "OTP Verification", "Bulk SMS", "API Access"] },
  { title: "Developers", links: ["Documentation", "API Reference", "SDKs", "Webhooks", "Status"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Press", "Partners"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies", "GDPR", "Compliance"] },
];

const SOCIAL_ICONS = [Twitter, Linkedin, MessageCircle];

export function Footer() {
  return (
    <footer style={{
      background: "#fff",
      borderTop: "1px solid #e4e8f0",
      width: "100%"
    }}>
      <div style={{
        margin: "0 auto",
        padding: "clamp(48px,7vw,80px) clamp(16px,4vw,40px) clamp(24px,4vw,36px)"
      }}>
        {/* Main Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "clamp(28px,4vw,52px)",
          marginBottom: "clamp(36px,5vw,56px)"
        }}>
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
               <Image src={logo1} alt="Femoj Logo" width={32} height={32} />
              <span className="text- font-bold text-[#0d1117] tracking-[-0.025em]">Femoj World</span>
            </div>
            <p className="text-sm text-[#6e7891] leading-relaxed mb-5 max-w-[200px]">
              Virtual phone number infrastructure for the modern internet.
            </p>
            <div className="flex gap-3">
              {SOCIAL_ICONS.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full border border-[#e4e8f0] flex items-center justify-center text-[#6e7891] transition-all duration-150 hover:border-[#1a73e8] hover:text-[#1a73e8]"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
          {/* Footer Columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold text-[#0d1117] uppercase tracking-[0.08em] mb-3.5">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#6e7891] no-underline transition-colors duration-150 hover:text-[#1a73e8]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#e4e8f0] pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-xs text-[#b0b8cc]">© 2025 Femoj, Inc. All rights reserved.</p>
            <span className="text-xs text-[#b0b8cc]">•</span>
            <p className="text-xs text-[#b0b8cc]">Powered by Remonode</p>
          </div>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs text-[#b0b8cc] no-underline transition-colors duration-150 hover:text-[#0d1117]"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
