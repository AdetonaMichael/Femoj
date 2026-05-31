"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MOCK_SMS_CONVERSATIONS, MOCK_SMS_MESSAGES } from "@/mock/data";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  Phone,
  MessageSquare,
  ChevronLeft,
  Archive,
  Trash2,
  MoreVertical,
  CheckCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendSMSSchema } from "@/schemas";
import { toast } from "sonner";
import { formatDate } from "@/utils";
import type { SMSConversation, SMSMessage } from "@/types";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface SendSMSFormValues {
  message: string;
}

/* ─── Animation ───────────────────────────────────────────────────────────── */
const fadeIn = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const msgIn = (direction: "inbound" | "outbound") => ({
  hidden: { opacity: 0, x: direction === "inbound" ? -8 : 8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.18 } },
});

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function SMSPage() {
  const conversations = MOCK_SMS_CONVERSATIONS as SMSConversation[];
  const allMessages = MOCK_SMS_MESSAGES as SMSMessage[];

  const [selected, setSelected] = useState<SMSConversation | null>(
    conversations[0] ?? null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const form = useForm<SendSMSFormValues>({
    resolver: zodResolver(sendSMSSchema),
    defaultValues: { message: "" },
  });

  const onSubmit = async (_data: SendSMSFormValues) => {
    try {
      toast.success("Message sent");
      form.reset();
    } catch {
      toast.error("Failed to send message");
    }
  };

  const filteredConvs = conversations.filter(
    (c) =>
      c.phoneNumber.includes(searchTerm) ||
      c.senderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMessages = allMessages.filter(
    (m) => m.conversationId === selected?.id
  );

  const selectConversation = (conv: SMSConversation) => {
    setSelected(conv);
    setMobileView("chat");
  };

  return (
    <DashboardLayout>
      <div
        className="flex flex-col bg-white"
        style={{
          fontFamily: "'Google Sans', 'Roboto', sans-serif",
          height: "calc(100vh - 64px)", // adjust to your shell's header height
        }}
      >
        {/* ── Page title bar (visible only on mobile) ────────────────────── */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#e8eaed]">
          {mobileView === "chat" && selected ? (
            <button
              onClick={() => setMobileView("list")}
              className="flex items-center gap-1.5 text-sm text-[#1a73e8] font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <h1 className="text-[17px] font-medium text-[#202124]">
              SMS Center
            </h1>
          )}
        </div>

        {/* ── Main layout ─────────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">
          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <aside
            className={`
              ${mobileView === "chat" ? "hidden" : "flex"} md:flex
              flex-col w-full md:w-[280px] lg:w-[320px] shrink-0
              border-r border-[#e8eaed] bg-white
            `}
          >
            {/* Sidebar header */}
            <div className="px-4 py-3 border-b border-[#e8eaed]">
              <h1 className="hidden md:block text-[15px] font-medium text-[#202124] mb-3">
                SMS Center
              </h1>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9aa0a6]" />
                <input
                  type="text"
                  placeholder="Search conversations…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 text-sm rounded-md border border-[#dadce0] bg-[#f8f9fa] text-[#202124] placeholder:text-[#9aa0a6] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.length === 0 ? (
                <p className="text-sm text-[#5f6368] text-center py-10">
                  No conversations found.
                </p>
              ) : (
                filteredConvs.map((conv) => {
                  const isActive = selected?.id === conv.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => selectConversation(conv)}
                      className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-[#f1f3f4] transition-colors ${
                        isActive
                          ? "bg-[#e8f0fe]"
                          : "hover:bg-[#f8f9fa]"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1a73e8] text-white text-xs font-semibold">
                        {getInitials(conv.senderName)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2 mb-0.5">
                          <p
                            className={`text-sm truncate ${
                              isActive
                                ? "font-semibold text-[#1a73e8]"
                                : conv.unreadCount > 0
                                ? "font-semibold text-[#202124]"
                                : "font-normal text-[#202124]"
                            }`}
                          >
                            {conv.senderName}
                          </p>
                          <span className="text-[10px] text-[#5f6368] shrink-0">
                            {formatDate(conv.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-xs text-[#5f6368] mb-0.5">
                          {conv.phoneNumber}
                        </p>
                        <p className="text-xs text-[#5f6368] truncate">
                          {conv.lastMessage.content}
                        </p>
                      </div>

                      {/* Unread badge */}
                      {conv.unreadCount > 0 && (
                        <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-[#1a73e8] px-1 text-[10px] font-semibold text-white">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Sidebar footer actions */}
            <div className="flex gap-2 px-4 py-3 border-t border-[#e8eaed]">
              <button className="flex flex-1 items-center justify-center gap-1.5 h-8 rounded border border-[#dadce0] text-xs font-medium text-[#5f6368] hover:bg-[#f8f9fa] transition-colors">
                <Archive className="w-3.5 h-3.5" />
                Archive
              </button>
              <button className="flex flex-1 items-center justify-center gap-1.5 h-8 rounded border border-[#dadce0] text-xs font-medium text-[#c5221f] hover:bg-[#fce8e6] transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </aside>

          {/* ── Chat panel ────────────────────────────────────────────────── */}
          <main
            className={`
              ${mobileView === "list" ? "hidden" : "flex"} md:flex
              flex-col flex-1 min-w-0 bg-white
            `}
          >
            {selected ? (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#e8eaed] bg-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a73e8] text-white text-xs font-semibold shrink-0">
                      {getInitials(selected.senderName)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#202124]">
                        {selected.senderName}
                      </p>
                      <p className="text-xs text-[#5f6368]">
                        {selected.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f1f3f4] transition-colors text-[#5f6368]">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f1f3f4] transition-colors text-[#5f6368]">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#f8f9fa]">
                  <AnimatePresence initial={false}>
                    {activeMessages.map((msg) => {
                      const isOutbound = msg.direction === "outbound";
                      return (
                        <motion.div
                          key={msg.id}
                          variants={msgIn(msg.direction)}
                          initial="hidden"
                          animate="show"
                          className={`flex ${
                            isOutbound ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex flex-col max-w-[72%] ${
                              isOutbound ? "items-end" : "items-start"
                            }`}
                          >
                            <div
                              className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                                isOutbound
                                  ? "bg-[#1a73e8] text-white rounded-br-sm"
                                  : "bg-white text-[#202124] border border-[#e8eaed] rounded-bl-sm"
                              }`}
                            >
                              {msg.content}
                            </div>
                            <div
                              className={`flex items-center gap-1 mt-1 ${
                                isOutbound ? "flex-row-reverse" : "flex-row"
                              }`}
                            >
                              <span className="text-[10px] text-[#9aa0a6]">
                                {formatDate(msg.createdAt)}
                              </span>
                              {isOutbound && (
                                <CheckCheck className="w-3 h-3 text-[#1a73e8]" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {activeMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                      <MessageSquare className="w-8 h-8 text-[#dadce0] mb-2" />
                      <p className="text-sm text-[#5f6368]">
                        No messages yet
                      </p>
                    </div>
                  )}
                </div>

                {/* Compose bar */}
                <div className="px-4 py-3 border-t border-[#e8eaed] bg-white">
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex items-center gap-2"
                  >
                    <input
                      {...form.register("message")}
                      placeholder="Type a message…"
                      autoComplete="off"
                      className="flex-1 h-9 px-3.5 text-sm rounded-full border border-[#dadce0] bg-[#f8f9fa] text-[#202124] placeholder:text-[#9aa0a6] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] focus:bg-white transition-colors"
                    />
                    <button
                      type="submit"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1a73e8] hover:bg-[#1765cc] text-white transition-colors disabled:opacity-40"
                      disabled={form.formState.isSubmitting}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  {form.formState.errors.message && (
                    <p className="text-xs text-[#c5221f] mt-1.5 pl-1">
                      {form.formState.errors.message.message as string}
                    </p>
                  )}
                </div>
              </>
            ) : (
              /* Empty state */
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="show"
                className="flex flex-col items-center justify-center flex-1 bg-[#f8f9fa]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f0fe] mb-4">
                  <MessageSquare className="w-6 h-6 text-[#1a73e8]" />
                </div>
                <p className="text-sm font-medium text-[#202124] mb-1">
                  No conversation selected
                </p>
                <p className="text-xs text-[#5f6368]">
                  Choose a conversation from the list to start messaging.
                </p>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}