"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Input, Container } from "@/components/ui";
import { MOCK_SMS_CONVERSATIONS, MOCK_SMS_MESSAGES } from "@/mock/data";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import {
  Search,
  Send,
  Phone,
  Clock,
  MessageCircle,
  ChevronLeft,
  Paperclip,
  Smile,
  Archive,
  Trash2,
  Star,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendSMSSchema } from "@/schemas";
import { toast } from "sonner";
import { formatDate } from "@/utils";
import type { SMSConversation } from "@/types";

export default function SMSPage() {
  const [selectedConversation, setSelectedConversation] = useState<SMSConversation | null>(MOCK_SMS_CONVERSATIONS[0]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const form = useForm({
    resolver: zodResolver(sendSMSSchema),
    defaultValues: { message: "" },
  });

  const onSubmit = async (data: any) => {
    try {
      toast.success("Message sent successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const filteredConversations = MOCK_SMS_CONVERSATIONS.filter((conv) =>
    conv.phoneNumber.includes(searchTerm) || conv.senderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <motion.div
        className="h-screen flex flex-col overflow-hidden"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {/* Conversations List */}
          <motion.div
            className="hidden md:flex flex-col border-r border-border bg-muted/30"
            variants={staggerItem}
          >
            <div className="p-4 border-b border-border">
              <h1 className="text-2xl font-bold mb-4">SMS Center</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  className={`p-3 cursor-pointer border-b border-border hover:bg-muted transition-colors ${
                    selectedConversation?.id === conv.id ? "bg-primary/10" : ""
                  }`}
                  onClick={() => setSelectedConversation(conv)}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm">{conv.senderName}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(conv.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {conv.phoneNumber}
                  </p>
                  <p className="text-xs text-muted-foreground truncate line-clamp-2">
                    {conv.lastMessage.content}
                  </p>
                  {conv.unreadCount > 0 && (
                    <Badge variant="danger" className="mt-2 text-xs">
                      {conv.unreadCount} unread
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-border space-y-2">
              <Button variant="outline" fullWidth className="gap-2">
                <Archive className="w-4 h-4" />
                Archive
              </Button>
              <Button variant="outline" fullWidth className="gap-2 text-danger">
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            className="md:col-span-2 flex flex-col"
            variants={staggerItem}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div>
                      <h2 className="font-semibold text-lg">
                        {selectedConversation.senderName}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {MOCK_SMS_MESSAGES.filter(
                    (msg) => msg.conversationId === selectedConversation.id
                  ).map((message) => (
                    <motion.div
                      key={message.id}
                      className={`flex ${
                        message.direction === "inbound"
                          ? "justify-start"
                          : "justify-end"
                      }`}
                      variants={staggerItem}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.direction === "inbound"
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-sm break-words">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            message.direction === "inbound"
                              ? "text-muted-foreground"
                              : "text-primary-foreground/70"
                          }`}
                        >
                          {formatDate(message.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border bg-muted/30">
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex gap-2"
                  >
                    <Button variant="ghost" size="icon">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      {...form.register("message")}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button type="submit" size="icon" className="gap-2">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                  {form.formState.errors.message && (
                    <p className="text-xs text-danger mt-2">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
