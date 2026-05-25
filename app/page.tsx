"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight, Globe, MessageSquare, Zap, ShieldCheck,
  Phone, Lock, BarChart2, Users, ChevronLeft, ChevronRight,
  Check, BadgeCheck, Menu, X, Mail, Twitter, Linkedin,
  Send, MessageCircle, Search, Heart, Music, CreditCard,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";
import { logo1, upwork, fiverr, linkedin, meta, whatsapp, google, shopify, airbnb, discord, uber, telegram, snapchat, payoneer } from "../public";

// ── TOKENS ───────────────────────────────────────────────────────────────────
const B = "#1a73e8";      // brand blue
const BD = "#1557b0";     // blue dark
const BL = "#e8f0fe";     // blue light
const INK = "#0d1117";    // near-black
const MUTED = "#6e7891";  // body text
const BORDER = "#e4e8f0"; // default border
const SURFACE = "#f7f8fc";// off-white surface

// ── DATA ─────────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    h1a: "Virtual Numbers",
    h1b: "Built for Scale.",
    body: "Provision local phone numbers in 150+ countries in seconds. Receive OTPs, manage SMS, and automate verification — from one clean dashboard.",
  },
  {
    h1a: "Integrate in Minutes,",
    h1b: "Ship in Days.",
    body: "REST APIs, webhooks, and SDKs for Node, Python, PHP and Go. Full documentation that treats your time with respect.",
  },
  {
    h1a: "Security You",
    h1b: "Can't Outgrow.",
    body: "SOC 2 certified infrastructure, end-to-end encryption, and 99.99% uptime SLA. Built for teams that move fast and can't afford to fail.",
  },
];

const SERVICES = [
  { icon: Globe,        title: "Virtual Numbers",   desc: "Local, national and toll-free numbers across 150+ countries. Activate instantly, cancel anytime.",        tags: ["150+ Countries", "Instant"] },
  { icon: MessageSquare,title: "SMS Inbox",          desc: "One inbox for all incoming messages. Search, filter and export everything — in real time.",                tags: ["Real-time", "Exportable"] },
  { icon: ShieldCheck,  title: "OTP Verification",  desc: "Receive one-time passcodes from WhatsApp, Telegram, Google, Facebook and 200+ services.",                  tags: ["200+ Platforms", "< 2s"] },
  { icon: Zap,          title: "Developer APIs",     desc: "Webhooks, SDKs, sandbox environments. Clean REST docs with copy-paste code samples.",                       tags: ["REST", "5 SDKs"] },
  { icon: Lock,         title: "Privacy Numbers",    desc: "Keep your personal number private. Disposable numbers for classifieds, dating and marketplaces.",           tags: ["Anonymous", "Disposable"] },
  { icon: BarChart2,    title: "Usage Analytics",    desc: "Delivery rates, spend tracking, number health — live dashboards and scheduled CSV reports.",                tags: ["Live Stats", "Reports"] },
];

const WHY = [
  { icon: Zap,         title: "Under 2 seconds",      desc: "Activation and message delivery, anywhere on the planet." },
  { icon: ShieldCheck, title: "SOC 2 Certified",       desc: "Encrypted infrastructure, audit logs and role-based access." },
  { icon: Globe,       title: "500+ Operators",        desc: "150 countries, every major carrier, one unified API." },
  { icon: Users,       title: "Human Support 24/7",    desc: "Real people via chat, email and phone — no bots, no scripts." },
];

// const STATS = [
//   { n: "150+",   label: "Countries" },
//   { n: "10K+",   label: "Businesses" },
//   { n: "99.99%", label: "Uptime" },
//   { n: "< 2s",   label: "Delivery" },
// ];

// const PLANS = [
//   {
//     name: "Starter", price: "$9",  per: "/mo",
//     note: "For individuals and small projects.",
//     items: ["5 virtual numbers", "500 SMS / month", "10 countries", "Basic API", "Email support"],
//     cta: "Start free", hot: false,
//   },
//   {
//     name: "Pro",     price: "$29", per: "/mo",
//     note: "For growing teams with global reach.",
//     items: ["25 numbers", "5,000 SMS / month", "50 countries", "Full API + webhooks", "Priority support", "Analytics"],
//     cta: "Start free", hot: true,
//   },
//   {
//     name: "Enterprise", price: "Custom", per: "",
//     note: "Tailored for large-scale operations.",
//     items: ["Unlimited numbers", "Unlimited SMS", "150+ countries", "Dedicated infra", "SLA", "24/7 support", "Custom terms"],
//     cta: "Talk to us", hot: false,
//   },
// ];

// const NAV_LINKS = [
//   { label: "Products",    href: "#services" },
//   { label: "Developers",  href: "#" },
//   { label: "Enterprise",  href: "#" },
// ];

const BG_IMGS = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=75",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1800&q=75",
  "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1800&q=75",
];

// ── HEADER ────────────────────────────────────────────────────────────────────

function Header() {
  const [scrolled, setScrolled]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const hdrBg = scrolled
    ? "rgba(255,255,255,0.96)"
    : "rgba(255,255,255,0)";
  const hdrBorder = scrolled ? `1px solid ${BORDER}` : "1px solid transparent";
  const linkColor = scrolled ? INK : "#fff";
  const linkHover = scrolled ? B : "rgba(255,255,255,0.75)";

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: hdrBg, backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: hdrBorder, transition: "all 0.25s",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "0 clamp(16px,4vw,40px)",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* Logo */}
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{
            width:34, height:34, borderRadius:9,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          }}>
            <Image src={logo1} style={{borderRadius:"100%"}} alt="Femoj Logo" width={34} height={34} />
          </div>
          <span style={{
            fontSize:18, fontWeight:800, color: scrolled ? INK : "#fff",
            letterSpacing:"-0.025em", fontFamily:"'DM Sans',sans-serif",
            transition:"color 0.2s",
          }}>Femoj World</span>
        </Link>

        {/* Desktop nav */}
        {/* <nav className="hdr-nav" style={{ display:"flex", gap:2 }}>
          {NAV_LINKS.map(n => (
            <a key={n.label} href={n.href} style={{
              padding:"8px 14px", fontSize:14, fontWeight:500,
              color: linkColor, textDecoration:"none", borderRadius:7,
              transition:"color 0.15s, background 0.15s",
            }}
              onMouseOver={e => { e.currentTarget.style.color = linkHover; e.currentTarget.style.background = scrolled ? "#f0f4ff" : "rgba(255,255,255,0.1)"; }}
              onMouseOut={e  => { e.currentTarget.style.color = linkColor;  e.currentTarget.style.background = "transparent"; }}
            >{n.label}</a>
          ))}
        </nav> */}

        {/* Auth */}
        <div className="hdr-nav" style={{ display:"flex", gap:8, alignItems:"center" }}>
          <Link href="/auth/login" style={{
            padding:"8px 16px", fontSize:14, fontWeight:500,
            color: scrolled ? MUTED : "rgba(255,255,255,0.85)", textDecoration:"none",
            borderRadius:7, transition:"color 0.15s",
          }}
            onMouseOver={e => e.currentTarget.style.color = scrolled ? INK : "#fff"}
            onMouseOut={e  => e.currentTarget.style.color = scrolled ? MUTED : "rgba(255,255,255,0.85)"}
          >Sign in</Link>

          <Link href="/auth/register" style={{
            padding:"9px 20px", fontSize:14, fontWeight:700,
            color:"#fff", background: B, textDecoration:"none",
            borderRadius:8, letterSpacing:"-0.01em",
            transition:"background 0.15s, transform 0.1s",
          }}
            onMouseOver={e => { e.currentTarget.style.background = BD; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseOut={e  => { e.currentTarget.style.background = B;  e.currentTarget.style.transform = "none"; }}
          >Get started</Link>
        </div>

      </div>
    </header>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  const [active, setActive] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const go = (idx: number) => setActive((idx + SLIDES.length) % SLIDES.length);
  const reset = () => { 
    if (timer.current) clearInterval(timer.current); 
    timer.current = setInterval(() => setActive(p => (p+1)%SLIDES.length), 5500); 
  };

  useEffect(() => { reset(); return () => { if (timer.current) clearInterval(timer.current); }; }, []);

  const slide = SLIDES[active];

  return (
    <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden" }}>

      {/* Background images */}
      {BG_IMGS.map((src, i) => (
        <div key={i} style={{
          position:"absolute", inset:0,
          opacity: i === active ? 1 : 0,
          transition:"opacity 1.4s ease",
        }}>
          <img src={src} alt="" style={{
            width:"100%", height:"100%", objectFit:"cover",
            filter:"brightness(0.38) saturate(0.8)",
          }}/>
        </div>
      ))}

      {/* gradient overlays */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(105deg, rgba(0,0,0,0.35) 42%, rgba(0,0,0,0.12) 100%)" }}/>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 55%)" }}/>
      {/* blue accent */}
      <div style={{ position:"absolute", top:"15%", left:"-8%", width:480, height:480, borderRadius:"50%", background:`radial-gradient(circle, ${B}28 0%, transparent 68%)`, pointerEvents:"none" }}/>

      <div style={{
        position:"relative", zIndex:10, width:"100%", maxWidth:1200,
        margin:"0 auto", padding:"clamp(110px,14vw,150px) clamp(16px,4vw,40px) clamp(80px,10vw,120px)",
      }} className="hero-layout">
        {/* Text Content */}
        <div className="hero-text-content">

         

          {/* Headline */}
          <h1 style={{
            fontSize:"clamp(38px,7vw,76px)", fontWeight:900, lineHeight:1.0,
            letterSpacing:"-0.04em", color:"#fff", margin:"0 0 24px",
            fontFamily:"'DM Sans',sans-serif",
          }}>
            {slide.h1a}<br/>
            <span style={{ color: B }}>{slide.h1b}</span>
          </h1>

          <p style={{
            fontSize:"clamp(15px,1.8vw,18px)", lineHeight:1.75,
            color:"rgba(255,255,255,0.68)", margin:"0 0 40px", maxWidth:520,
          }}>
            {slide.body}
          </p>

          {/* Inline stats */}
          {/* <div style={{ display:"flex", flexWrap:"wrap", gap:"12px 36px", paddingTop:28, borderTop:"1px solid rgba(255,255,255,0.12)", marginBottom:32 }}>
            {STATS.map(s => (
              <div key={s.label}>
                <span style={{ fontSize:"clamp(18px,2.5vw,22px)", fontWeight:900, color:"#fff", letterSpacing:"-0.03em", fontFamily:"'DM Sans',sans-serif" }}>{s.n}</span>
                <span style={{ fontSize:13, color:"rgba(255,255,255,0.48)", marginLeft:6, fontWeight:500 }}>{s.label}</span>
              </div>
            ))}
          </div> */}

          {/* CTAs */}
          <div style={{ display:"flex", gap:12, justifyContent:"flex-start" }} className="hero-buttons">
            <Link href="/auth/register" style={{
              display:"inline-flex", alignItems:"center", gap:9,
              padding:"13px 26px", background: B, color:"#fff",
              fontSize:"clamp(13px, 2vw, 15px)", fontWeight:700, borderRadius:9, textDecoration:"none",
              boxShadow:`0 6px 28px ${B}44`,
              transition:"background 0.15s, transform 0.1s",
              whiteSpace:"nowrap",
            }}
              onMouseOver={e => { e.currentTarget.style.background = BD; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={e  => { e.currentTarget.style.background = B;  e.currentTarget.style.transform = "none"; }}
            >Get started <ArrowRight size={16}/></Link>

            <a href="#services" style={{
              display:"inline-flex", alignItems:"center", gap:9,
              padding:"13px 26px", border:"1px solid rgba(255,255,255,0.22)",
              color:"rgba(255,255,255,0.88)", fontSize:"clamp(13px, 2vw, 15px)", fontWeight:500,
              borderRadius:9, textDecoration:"none",
              background:"rgba(255,255,255,0.06)",
              backdropFilter:"blur(6px)",
              transition:"border-color 0.15s, background 0.15s",
              whiteSpace:"nowrap",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = `${B}80`; e.currentTarget.style.background = `${B}14`; }}
              onMouseOut={e  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            >Learn more <ArrowRight size={16}/></a>
          </div>
        </div>

        {/* Mockup Section */}
        <div className="mockup-only-section">

          {/* Mobile CTA Section */}
          <div style={{
            display: "none",
            textAlign: "center",
            marginBottom: 40,
          }} className="mobile-cta-section">
            <h2 style={{
              fontSize: "clamp(24px, 6vw, 32px)",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              color: "#fff",
              margin: "0 0 12px",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Ready to get started?
            </h2>
            <p style={{
              fontSize: "clamp(14px, 1.6vw, 16px)",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.72)",
              margin: "0 0 28px",
              maxWidth: 280,
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              Provision virtual numbers in 150+ countries instantly and start receiving SMS today.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/auth/register" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "13px 26px",
                background: B,
                color: "#fff",
                fontSize: "clamp(13px, 2vw, 15px)",
                fontWeight: 700,
                borderRadius: 9,
                textDecoration: "none",
                boxShadow: `0 6px 28px ${B}44`,
                transition: "background 0.15s, transform 0.1s",
                whiteSpace: "nowrap",
              }}
                onMouseOver={e => { e.currentTarget.style.background = BD; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={e => { e.currentTarget.style.background = B; e.currentTarget.style.transform = "none"; }}
              >Get started <ArrowRight size={16} /></Link>

              <a href="#services" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "13px 26px",
                border: "1px solid rgba(255,255,255,0.22)",
                color: "rgba(255,255,255,0.88)",
                fontSize: "clamp(13px, 2vw, 15px)",
                fontWeight: 500,
                borderRadius: 9,
                textDecoration: "none",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(6px)",
                transition: "border-color 0.15s, background 0.15s",
                whiteSpace: "nowrap",
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = `${B}80`; e.currentTarget.style.background = `${B}14`; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              >Learn more <ArrowRight size={16} /></a>
            </div>
          </div>

          {/* Mobile Mockup */}
          <div style={{
            position:"relative", width:320, height:640,
            borderRadius:"54px", border:"12px solid #1f2937",
            background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow:"0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
            overflow:"visible",
          }}>
            {/* Notch */}
            <div style={{
              position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
              width:150, height:26, background:"#1f2937",
              borderBottomLeftRadius:20, borderBottomRightRadius:20, zIndex:20,
            }}/>

            {/* Screen content */}
            <div style={{
              position:"absolute", inset:"16px", background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius:"40px", overflow:"hidden", display:"flex",
              flexDirection:"column", justifyContent:"space-between", padding:24,
            }}>
              {/* Top content */}
              <div>
                <div style={{
                  background:"rgba(255,255,255,0.15)", backdropFilter:"blur(10px)",
                  borderRadius:16, padding:"12px 16px", marginBottom:24,
                  border:"1px solid rgba(255,255,255,0.2)",
                }}>
                  <p style={{ fontSize:10, color:"rgba(255,255,255,0.6)", margin:0 }}>Welcome back</p>
                  <p style={{ fontSize:18, fontWeight:700, color:"#fff", margin:"4px 0 0" }}>Femoj User</p>
                </div>
                <div style={{
                  background:"rgba(255,255,255,0.15)", backdropFilter:"blur(10px)",
                  borderRadius:16, padding:16, marginBottom:16,
                  border:"1px solid rgba(255,255,255,0.2)",
                }}>
                  <p style={{ fontSize:9, color:"rgba(255,255,255,0.6)", margin:"0 0 8px" }}>Available Balance</p>
                  <p style={{ fontSize:20, fontWeight:700, color:"#fff", margin:0 }}>$4,250.50</p>
                </div>
              </div>

              {/* Bottom stats */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div style={{
                  background:"rgba(255,255,255,0.1)", backdropFilter:"blur(10px)",
                  borderRadius:12, padding:12, textAlign:"center",
                  border:"1px solid rgba(255,255,255,0.15)",
                }}>
                  <p style={{ fontSize:10, color:"rgba(255,255,255,0.5)", margin:0 }}>Numbers</p>
                  <p style={{ fontSize:16, fontWeight:700, color:"#fff", margin:"4px 0 0" }}>12</p>
                </div>
                <div style={{
                  background:"rgba(255,255,255,0.1)", backdropFilter:"blur(10px)",
                  borderRadius:12, padding:12, textAlign:"center",
                  border:"1px solid rgba(255,255,255,0.15)",
                }}>
                  <p style={{ fontSize:10, color:"rgba(255,255,255,0.5)", margin:0 }}>Messages</p>
                  <p style={{ fontSize:16, fontWeight:700, color:"#fff", margin:"4px 0 0" }}>284</p>
                </div>
              </div>
            </div>

            {/* Top-left badge */}
            <div style={{
              position: "absolute",
              top: -20,
              left: -20,
              background: "#fff",
              borderRadius: 16,
              padding: "12px 16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              minWidth: 160,
              zIndex: 30,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Image src={whatsapp} alt="WhatsApp" width={28} height={28} style={{ borderRadius: 6 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0d1117" }}>WhatsApp</span>
              </div>
              <p style={{ fontSize: 10, color: "#6e7891", margin: 0, lineHeight: 1.4 }}>
                Receive messages & verify accounts instantly
              </p>
            </div>

            {/* Bottom-right badge */}
            <div style={{
              position: "absolute",
              bottom: -20,
              right: -20,
              background: "#fff",
              borderRadius: 16,
              padding: "12px 16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              minWidth: 160,
              zIndex: 30,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Image src={fiverr} alt="Fiverr" width={28} height={28} style={{ borderRadius: 6 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0d1117" }}>Fiverr</span>
              </div>
              <p style={{ fontSize: 10, color: "#6e7891", margin: 0, lineHeight: 1.4 }}>
                Getting numbers to scale faster
              </p>
            </div>
          </div>

        {/* Slide controls */}
        <div style={{
          position:"absolute", bottom:"clamp(24px,4vw,40px)", left:"clamp(16px,4vw,40px)",
          display:"flex", alignItems:"center", gap:14,
        }}>
          {[ChevronLeft, ChevronRight].map((Icon, dir) => (
            <button key={dir} onClick={() => { go(active + (dir === 0 ? -1 : 1)); reset(); }}
              style={{
                width:36, height:36, borderRadius:"50%",
                border:"1px solid rgba(255,255,255,0.22)",
                background:"rgba(255,255,255,0.08)", backdropFilter:"blur(8px)",
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", color:"#fff", transition:"background 0.15s",
              }}
              onMouseOver={e => e.currentTarget.style.background = `${B}50`}
              onMouseOut={e  => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            ><Icon size={17}/></button>
          ))}

          <div style={{ display:"flex", gap:7 }}>
            {SLIDES.map((_,i) => (
              <button key={i} onClick={() => { go(i); reset(); }}
                style={{
                  height:4, width: i === active ? 26 : 8, borderRadius:2,
                  background: i === active ? B : "rgba(255,255,255,0.3)",
                  border:"none", cursor:"pointer", padding:0,
                  transition:"width 0.3s, background 0.3s",
                }}
              />
            ))}
          </div>
        </div>
        </div>

      </div>
    </section>
  );
}

// ── PLATFORM BAR ─────────────────────────────────────────────────────────────

function PlatformBar() {
  type Platform = 
    | { name: string; type: "image"; icon: any }
    | { name: string; type: "badge"; bg: string; icon: string };

  const platforms: Platform[] = [
    { name: "WhatsApp", type: "image", icon: whatsapp },
    { name: "Telegram", type: "image", icon: telegram },
    { name: "Google", type: "image", icon: google },
    { name: "Facebook", type: "badge", bg: "#1877F2", icon: "f" },
    { name: "Twitter", type: "badge", bg: "#000000", icon: "𝕏" },
    { name: "Uber", type: "image", icon: uber },
    { name: "Discord", type: "image", icon: discord },
    { name: "Shopify", type: "image", icon: shopify },
    { name: "Airbnb", type: "image", icon: airbnb },
    { name: "Snapchat", type: "image", icon: snapchat },
    { name: "LinkedIn", type: "image", icon: linkedin },
    { name: "Meta", type: "image", icon: meta },
    { name: "Fiverr", type: "image", icon: fiverr },
    { name: "Upwork", type: "image", icon: upwork },
    { name: "Payoneer", type: "image", icon: payoneer },
    { name: "Stripe", type: "badge", bg: "#5469D4", icon: "⟋" },
  ];
  
  // Duplicate for infinite scroll
  const repeatedPlatforms = [...platforms, ...platforms];
  
  return (
    <section style={{
      borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}`,
      background: SURFACE, padding:"20px clamp(16px,4vw,40px)",
      overflow: "hidden",
    }}>
      <div style={{ margin:"0 auto" }}>
        <p style={{
          textAlign:"center", fontSize:11, fontWeight:700,
          color: MUTED, letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:14,
        }}>Receive SMS from any platform</p>
        
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .platform-marquee-wrapper {
            overflow: hidden;
            width: 100%;
          }
          .platform-marquee-content {
            display: flex;
            gap: 12px;
            animation: marquee 40s linear infinite;
            will-change: transform;
          }
          .platform-marquee-content:hover {
            animation-play-state: paused;
          }
        `}</style>
        
        <div className="platform-marquee-wrapper">
          <div className="platform-marquee-content">
            {repeatedPlatforms.map((platform, idx) => (
              <div key={`${platform.name}-${idx}`} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                borderRadius: 20,
                padding: "8px 14px",
                border: `1px solid ${BORDER}`,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}>
                {platform.type === "image" ? (
                  <Image src={platform.icon as any} alt={platform.name} width={20} height={20} style={{ borderRadius: 4 }} />
                ) : (
                  <div style={{
                    width: 20,
                    height: 20,
                    background: (platform as any).bg,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                  }}>{platform.icon as string}</div>
                )}
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0d1117" }}>{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SERVICES ─────────────────────────────────────────────────────────────────

function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 360, behavior:"smooth" });

  return (
    <section id="services" style={{ background:"#fff", padding:"clamp(64px,8vw,100px) 0", borderBottom:`1px solid ${BORDER}` }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 clamp(16px,4vw,40px)" }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:16, marginBottom:44 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color: B, letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:10 }}>Platform</p>
            <h2 style={{
              fontSize:"clamp(26px,4vw,44px)", fontWeight:900,
              letterSpacing:"-0.035em", color: INK, margin:0,
              fontFamily:"'DM Sans',sans-serif", lineHeight:1.1,
            }}>
              Everything in<br/>
              <span style={{ color: MUTED, fontWeight:400 }}>one place.</span>
            </h2>
          </div>

          <Link href="/auth/signup" style={{
            display:"inline-flex", alignItems:"center", gap:8,
            padding:"10px 18px", border:`1px solid ${BORDER}`,
            borderRadius:8, color: B, textDecoration:"none",
            fontSize:13, fontWeight:700, transition:"border-color 0.15s, background 0.15s",
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = `${B}80`; e.currentTarget.style.background = BL; }}
            onMouseOut={e  => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = "transparent"; }}
          >View all features <ArrowRight size={14}/></Link>
        </div>

        {/* Scroll row */}
        <div style={{ position:"relative" }}>
          <div ref={ref} style={{
            display:"flex", gap:14, overflowX:"auto", paddingBottom:4,
            scrollbarWidth:"none", msOverflowStyle:"none",
          }}>
            {SERVICES.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.title} style={{
                  flexShrink:0, width:"clamp(240px,28vw,300px)",
                  border:`1px solid ${BORDER}`, borderRadius:16,
                  padding:"clamp(22px,3vw,28px)", background:"#fff",
                  transition:"border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                  cursor:"default",
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = `${B}60`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${B}14`; }}
                  onMouseOut={e  => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{
                    width:46, height:46, borderRadius:12, background: BL,
                    display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18,
                  }}>
                    <Icon size={20} color={B} strokeWidth={2}/>
                  </div>
                  <h3 style={{ fontSize:15, fontWeight:700, color: INK, margin:"0 0 8px", letterSpacing:"-0.01em" }}>{s.title}</h3>
                  <p style={{ fontSize:13, color: MUTED, margin:"0 0 18px", lineHeight:1.7 }}>{s.desc}</p>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {s.tags.map(t => (
                      <span key={t} style={{
                        fontSize:11, fontWeight:600, color: B, background: BL,
                        padding:"3px 9px", borderRadius:100, letterSpacing:"0.02em",
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Arrow btns */}
          {[-1, 1].map(dir => (
            <button key={dir} onClick={() => scroll(dir)} style={{
              position:"absolute", top:"50%",
              [dir === -1 ? "left" : "right"]: -16,
              transform:"translateY(-50%)",
              width:34, height:34, borderRadius:"50%",
              border:`1px solid ${BORDER}`, background:"#fff",
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", color: MUTED, boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
              transition:"border-color 0.15s, color 0.15s",
              zIndex:10,
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = B; e.currentTarget.style.color = B; }}
              onMouseOut={e  => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
            >
              {dir === -1 ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── REMOPAY PROMO ────────────────────────────────────────────────────────────

function RemopayPromo() {
  return (
    <section style={{
      background: `linear-gradient(135deg, ${B}14 0%, rgba(26, 115, 232, 0.08) 100%)`,
      padding: "clamp(64px,8vw,100px) 0",
      borderBottom: `1px solid ${BORDER}`,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,40px)" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px,6vw,60px)",
          alignItems: "center",
        }} className="remopay-grid">
          {/* Left Content */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 700, color: B,
              letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 12,
            }}>Financial Solutions</p>
            
            <h2 style={{
              fontSize: "clamp(28px,4vw,48px)", fontWeight: 900,
              letterSpacing: "-0.035em", color: INK, margin: "0 0 16px",
              fontFamily: "'DM Sans',sans-serif", lineHeight: 1.15,
            }}>Everything You Need,<br/>
            <span style={{ color: B }}>One Card Away</span></h2>
            
            <p style={{
              fontSize: "clamp(15px,1.8vw,17px)", lineHeight: 1.8,
              color: MUTED, margin: "0 0 32px", maxWidth: 480,
            }}>
              Get your virtual dollar card and manage all your finances in one place. Purchase airtime, data, pay electricity bills, and more — all at your fingertips.
            </p>

            {/* Features */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {["Virtual Dollar Card", "Airtime & Data Purchase", "Bill Payments", "Real-time Transactions"].map((feature) => (
                <div key={feature} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: BL, display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                  }}>
                    <Check size={14} color={B} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: INK }}>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="https://remopay.remonode.com" target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                padding: "14px 28px", background: B, color: "#fff",
                fontSize: "clamp(13px, 2vw, 15px)", fontWeight: 700, borderRadius: 9,
                textDecoration: "none", boxShadow: `0 6px 28px ${B}44`,
                transition: "background 0.15s, transform 0.1s",
              }}
                onMouseOver={e => { e.currentTarget.style.background = BD; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={e => { e.currentTarget.style.background = B; e.currentTarget.style.transform = "none"; }}
              >Visit Remopay <ArrowRight size={16} /></a>

              <a href="https://remopay.remonode.com" target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                padding: "14px 28px", border: `1px solid ${BORDER}`,
                color: INK, fontSize: "clamp(13px, 2vw, 15px)", fontWeight: 700,
                borderRadius: 9, textDecoration: "none",
                background: "#fff",
                transition: "border-color 0.15s, background 0.15s, transform 0.1s",
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = B; e.currentTarget.style.background = BL; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "none"; }}
              >Download Now</a>
            </div>
          </div>

          {/* Right Visual */}
          <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {/* Card mockup background */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${B} 0%, ${BD} 100%)`,
              borderRadius: "24px",
              opacity: 0.15,
            }} />

            {/* Main card */}
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: 320,
              background: `linear-gradient(135deg, ${B} 0%, ${BD} 100%)`,
              borderRadius: "20px",
              padding: 32,
              color: "#fff",
              boxShadow: `0 20px 60px ${B}30`,
              transform: "perspective(1000px) rotateY(-8px)",
            }}>
              {/* Card header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }}>REMOPAY</span>
                <div style={{
                  width: 44, height: 28,
                  background: "rgba(255,255,255,0.3)",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                }}>VISA</div>
              </div>

              {/* Card number */}
              <p style={{ fontSize: 18, letterSpacing: "0.1em", margin: "0 0 32px", fontFamily: "monospace", fontWeight: 600 }}>
                4532 •••• •••• 8901
              </p>

              {/* Card footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", margin: "0 0 4px" }}>CARDHOLDER</p>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Your Name</p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", margin: "0 0 4px" }}>VALID THRU</p>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>12/28</p>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div style={{
              position: "absolute",
              top: -20,
              right: -20,
              background: "#fff",
              borderRadius: 16,
              padding: "12px 16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              zIndex: 10,
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, margin: "0 0 4px", textTransform: "uppercase" }}>Instant Setup</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: INK, margin: 0 }}>2 Minutes</p>
            </div>

            <div style={{
              position: "absolute",
              bottom: -20,
              left: -20,
              background: "#fff",
              borderRadius: 16,
              padding: "12px 16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              zIndex: 10,
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, margin: "0 0 4px", textTransform: "uppercase" }}>Zero Fees</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: INK, margin: 0 }}>Competitive Rates</p>
            </div>
          </div>
        </div>

        {/* Mobile responsive */}
        <style>{`
          @media (max-width: 768px) {
            .remopay-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

// ── MOBILE APP PROMO ─────────────────────────────────────────────────────────

function MobileAppPromo() {
  return (
    <section style={{
      background: SURFACE,
      padding: "clamp(64px,8vw,100px) 0",
      borderBottom: `1px solid ${BORDER}`,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-5%",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: `${B}08`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-10%",
        left: "-5%",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: `${B}06`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,40px)", position: "relative", zIndex: 2 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px,6vw,60px)",
          alignItems: "center",
        }} className="app-promo-grid">
          
          {/* Left Visual - Phone Mockup */}
          <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {/* Phone frame */}
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: 320,
              height: 580,
              background: "#000",
              borderRadius: "40px",
              border: "12px solid #1a1a1a",
              boxShadow: `0 30px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`,
              overflow: "hidden",
            }}>
              {/* Notch */}
              <div style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 150,
                height: 28,
                background: "#000",
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                zIndex: 20,
              }} />

              {/* Screen */}
              <div style={{
                position: "relative",
                aspectRatio: "9/16",
                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                paddingTop: 40,
              }}>
                {/* App content preview */}
                <div style={{ textAlign: "center", color: "#fff" }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: 30,
                    fontWeight: 700,
                  }}>F</div>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px", letterSpacing: "0.02em" }}>Femoj App</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.5 }}>
                    Manage your virtual numbers on the go
                  </p>
                </div>

                {/* Bottom section */}
                <div style={{
                  position: "absolute",
                  bottom: 20,
                  left: 0,
                  right: 0,
                  padding: "0 20px",
                }}>
                  <div style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 12,
                    padding: 12,
                    border: "1px solid rgba(255,255,255,0.2)",
                    textAlign: "center",
                  }}>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", margin: "0 0 4px" }}>Coming Soon</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", margin: 0 }}>v1.0.0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div style={{
              position: "absolute",
              top: -20,
              right: -30,
              background: "#fff",
              borderRadius: 16,
              padding: "12px 18px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              zIndex: 10,
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6e7891", margin: "0 0 4px", textTransform: "uppercase" }}>Beta Access</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0d1117", margin: 0 }}>Join Now</p>
            </div>
          </div>

          {/* Right Content */}
          <div style={{ color: INK }}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: B,
              letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 12,
            }}>Mobile App</p>

            <h2 style={{
              fontSize: "clamp(28px,4vw,48px)", fontWeight: 900,
              letterSpacing: "-0.035em", color: INK, margin: "0 0 16px",
              fontFamily: "'DM Sans',sans-serif", lineHeight: 1.15,
            }}>Management<br/>
            On the Go</h2>

            <p style={{
              fontSize: "clamp(15px,1.8vw,17px)", lineHeight: 1.8,
              color: MUTED, margin: "0 0 32px", maxWidth: 480,
            }}>
              Stay connected with your virtual numbers anywhere, anytime. Our mobile app brings the full power of Femoj to your pocket with intuitive design and seamless performance.
            </p>

            {/* Features */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {["SMS Management", "Number Control", "Analytics", "Instant Notifications"].map((feature) => (
                <div key={feature} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: BL, display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0, border: `1px solid ${BORDER}`,
                  }}>
                    <Check size={14} color={B} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: INK }}>{feature}</span>
                </div>
              ))}
            </div>

            {/* App Store & Google Play - Side by Side */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <a href="#" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                flex: 1, padding: "14px 16px", background: "#000", color: "#fff",
                fontSize: 13, fontWeight: 600, borderRadius: 12,
                textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"; }}
              >
                <Globe size={18} />
                <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Download on</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>App Store</div>
                </div>
              </a>

              <a href="#" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                flex: 1, padding: "14px 16px", background: "#0d1117", color: "#fff",
                fontSize: 13, fontWeight: 600, borderRadius: 12,
                textDecoration: "none", border: `1px solid ${BORDER}`,
                transition: "transform 0.2s, background 0.2s",
              }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "#1a1f2e"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "#0d1117"; }}
              >
                <Globe size={18} />
                <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Get it on</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>Google Play</div>
                </div>
              </a>
            </div>

            {/* Direct Download Link */}
            <a href="#" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "14px 24px", background: B, color: "#fff",
              fontSize: 14, fontWeight: 600, borderRadius: 9,
              textDecoration: "none", border: "none",
              transition: "background 0.2s, transform 0.2s",
            }}
              onMouseOver={e => { e.currentTarget.style.background = BD; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={e => { e.currentTarget.style.background = B; e.currentTarget.style.transform = "none"; }}
            >
              Direct Download <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Mobile responsive */}
        <style>{`
          @media (max-width: 768px) {
            .app-promo-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

//         <div style={{ textAlign:"center", marginBottom:52 }}>
//           <p style={{ fontSize:11, fontWeight:700, color: B, letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:12 }}>Pricing</p>
//           <h2 style={{
//             fontSize:"clamp(26px,4vw,44px)", fontWeight:900,
//             letterSpacing:"-0.035em", color: INK, margin:"0 0 12px",
//             fontFamily:"'DM Sans',sans-serif",
//           }}>Honest pricing.<br/>No surprises.</h2>
//           <p style={{ fontSize:16, color: MUTED, maxWidth:380, margin:"0 auto" }}>Cancel or upgrade at any time. No lock-in.</p>
//         </div>

//         <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16 }}>
//           {PLANS.map(p => (
//             <div key={p.name} style={{
//               position:"relative",
//               border: p.hot ? `2px solid ${B}` : `1px solid ${BORDER}`,
//               borderRadius:18, padding:"clamp(24px,3vw,36px)",
//               background: p.hot ? "#fff" : SURFACE,
//               display:"flex", flexDirection:"column",
//               boxShadow: p.hot ? `0 4px 32px ${B}18` : "none",
//             }}>
//               {p.hot && (
//                 <div style={{
//                   position:"absolute", top:-1, left:"50%",
//                   transform:"translateX(-50%) translateY(-50%)",
//                   background: B, color:"#fff", fontSize:10, fontWeight:800,
//                   padding:"4px 14px", borderRadius:100,
//                   letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap",
//                 }}>Most popular</div>
//               )}

//               <p style={{ fontSize:12, fontWeight:700, color: p.hot ? B : MUTED, margin:"0 0 4px", textTransform:"uppercase", letterSpacing:"0.06em" }}>{p.name}</p>
//               <p style={{ fontSize:13, color: MUTED, margin:"0 0 20px" }}>{p.note}</p>

//               <div style={{ display:"flex", alignItems:"baseline", gap:3, marginBottom:24 }}>
//                 <span style={{ fontSize:"clamp(32px,5vw,44px)", fontWeight:900, color: INK, letterSpacing:"-0.045em", fontFamily:"'DM Sans',sans-serif" }}>{p.price}</span>
//                 {p.per && <span style={{ fontSize:14, color: MUTED }}>{p.per}</span>}
//               </div>

//               <ul style={{ listStyle:"none", padding:0, margin:"0 0 28px", flex:1, display:"flex", flexDirection:"column", gap:10 }}>
//                 {p.items.map(f => (
//                   <li key={f} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color: INK }}>
//                     <Check size={14} color={B} strokeWidth={2.5} style={{ flexShrink:0 }}/>{f}
//                   </li>
//                 ))}
//               </ul>

//               <Link href="/auth/register" style={{
//                 display:"flex", alignItems:"center", justifyContent:"center", gap:8,
//                 padding:"12px 20px", borderRadius:9,
//                 fontSize:14, fontWeight:700, textDecoration:"none",
//                 background: p.hot ? B : "transparent",
//                 color: p.hot ? "#fff" : INK,
//                 border: p.hot ? "none" : `1px solid ${BORDER}`,
//                 transition:"background 0.15s, transform 0.1s, border-color 0.15s",
//               }}
//                 onMouseOver={e => { e.currentTarget.style.background = p.hot ? BD : BL; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = p.hot ? "transparent" : `${B}60`; }}
//                 onMouseOut={e  => { e.currentTarget.style.background = p.hot ? B : "transparent"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = p.hot ? "transparent" : BORDER; }}
//               >{p.cta} {p.hot && <ArrowRight size={14}/>}</Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
// ── INTEGRATION PARTNERS ─────────────────────────────────────────────────────

const INTEGRATION_PLATFORMS = [
  { name: "Upwork", icon: upwork, desc: "Freelancers verify clients instantly" },
  { name: "Fiverr", icon: fiverr, desc: "Sellers protect buyer transactions" },
  { name: "Meta", icon: meta, desc: "Ad account verification at scale" },
  { name: "LinkedIn", icon: linkedin, desc: "Professional identity confirmation" },
  { name: "WhatsApp", icon: whatsapp, desc: "Business account SMS reception" },
];

function IntegrationPartners() {
  return (
    <section style={{ background: SURFACE, padding: "clamp(64px,8vw,100px) 0", borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,40px)" }}>
        
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(48px,7vw,64px)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: B, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 10 }}>
            Integrations
          </p>
          <h2 style={{
            fontSize: "clamp(26px,4vw,44px)", fontWeight: 900,
            letterSpacing: "-0.035em", color: INK, margin: "0 0 16px",
            fontFamily: "'DM Sans',sans-serif", lineHeight: 1.1,
          }}>
            Trusted by Global<br/>
            <span style={{ color: MUTED, fontWeight: 400 }}>Platforms & Services</span>
          </h2>
        <IntegrationPartners/>
          <p style={{
            fontSize: "clamp(14px,1.8vw,16px)", color: MUTED,
            lineHeight: 1.6, maxWidth: 520, margin: "0 auto",
          }}>
            From freelance marketplaces to social platforms, businesses trust Femoj for instant, reliable SMS verification.
          </p>
        </div>

        {/* Integration Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "clamp(16px,3vw,24px)",
        }}>
          {INTEGRATION_PLATFORMS.map((platform) => (
            <div
              key={platform.name}
              style={{
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: "clamp(20px,3vw,28px)",
                background: "#fff",
                textAlign: "center",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "default",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = `${B}60`;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 12px 32px ${B}18`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = BORDER;
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Platform Icon */}
              <div style={{
                width: 56,
                height: 56,
                margin: "0 auto 16px",
                background: BL,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Image 
                  src={platform.icon} 
                  alt={platform.name}
                  width={32}
                  height={32}
                  style={{ objectFit: "contain" }}
                />
              </div>

              {/* Platform Name */}
              <h3 style={{
                fontSize: 16,
                fontWeight: 700,
                color: INK,
                margin: "0 0 8px",
                fontFamily: "'DM Sans',sans-serif",
              }}>
                {platform.name}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: 13,
                color: MUTED,
                margin: 0,
                lineHeight: 1.5,
              }}>
                {platform.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div style={{
          marginTop: "clamp(48px,7vw,64px)",
          textAlign: "center",
          padding: "clamp(32px,4vw,48px)",
          background: BL,
          borderRadius: 16,
          border: `1px solid ${B}30`,
        }}>
          <h3 style={{
            fontSize: "clamp(18px,2.5vw,24px)",
            fontWeight: 700,
            color: INK,
            margin: "0 0 12px",
            fontFamily: "'DM Sans',sans-serif",
          }}>
            Ready to integrate?
          </h3>
          <p style={{
            fontSize: 14,
            color: MUTED,
            margin: "0 0 20px",
            lineHeight: 1.6,
          }}>
            Get started with Femoj in minutes. Our REST APIs and webhooks make integration seamless.
          </p>
          <Link
            href="/auth/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: "11px 22px",
              background: B,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 8,
              textDecoration: "none",
              transition: "background 0.15s, transform 0.1s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = BD;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = B;
              e.currentTarget.style.transform = "none";
            }}
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

export default function FemojLanding() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { background:#fff; -webkit-font-smoothing:antialiased; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-thumb { background:#d0d8e8; border-radius:3px; }
        @keyframes dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @media (max-width:760px) {
          .hdr-nav { display:none !important; }
          .mobile-cta-section { display:block !important; }
        }
      `}</style>
      <div style={{ fontFamily:"'DM Sans',-apple-system,sans-serif", background:"#fff", color: INK, minHeight:"100vh" }}>
        <Header/>
        <Hero/>
        <PlatformBar/>
        <Services/>
        <RemopayPromo/>
        <MobileAppPromo/>
      
        {/* <Pricing/> */}
        <Footer/>
      </div>
    </>
  );
}