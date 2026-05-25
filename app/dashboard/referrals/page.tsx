"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Input } from "@/components/ui";
import { MOCK_REFERRAL_STATS } from "@/mock/data";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import {
  Users,
  TrendingUp,
  DollarSign,
  Copy,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/utils";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://femoj.com/ref/DEMO123456";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const message = `Join me on Femoj - the global virtual number marketplace! Use my referral link and get $10 bonus: ${referralLink}`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${referralLink}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${referralLink}`,
      email: `mailto:?subject=Join Femoj&body=${encodeURIComponent(message)}`,
    };
    window.open(urls[platform as keyof typeof urls], "_blank");
  };

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={staggerItem}>
          <h1 className="text-4xl font-bold mb-2">Referral Program</h1>
          <p className="text-muted-foreground">
            Earn rewards by inviting friends to Femoj
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Referrals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {MOCK_REFERRAL_STATS.totalReferrals}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  +5 this month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Referrals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {MOCK_REFERRAL_STATS.activeReferrals}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently active
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {formatCurrency(MOCK_REFERRAL_STATS.totalEarnings)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Commission earned
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Payout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {formatCurrency(MOCK_REFERRAL_STATS.pendingPayout)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Withdrawable balance
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Referral Link Section */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>
                Share this unique link to earn commissions from your referrals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-muted"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleShare("twitter")}
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleShare("facebook")}
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleShare("linkedin")}
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleShare("email")}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Commission Rates */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>Commission Rates</CardTitle>
              <CardDescription>
                Earn commissions based on your referrals' activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Number Purchases",
                    description: "10% commission on each number purchase",
                    rate: "10%",
                  },
                  {
                    title: "Monthly Subscriptions",
                    description: "20% recurring commission",
                    rate: "20%",
                  },
                  {
                    title: "Wallet Top-ups",
                    description: "5% commission on funded amounts",
                    rate: "5%",
                  },
                  {
                    title: "SMS Packages",
                    description: "15% commission on SMS package purchases",
                    rate: "15%",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Badge variant="success" className="text-lg">
                      {item.rate}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Referral History */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
              <CardDescription>
                Track your recent referrals and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "John Doe",
                    email: "john@example.com",
                    status: "Active",
                    joined: "2 days ago",
                    earned: 45.5,
                  },
                  {
                    name: "Jane Smith",
                    email: "jane@example.com",
                    status: "Active",
                    joined: "1 week ago",
                    earned: 128.75,
                  },
                  {
                    name: "Michael Brown",
                    email: "michael@example.com",
                    status: "Inactive",
                    joined: "2 weeks ago",
                    earned: 0,
                  },
                  {
                    name: "Sarah Wilson",
                    email: "sarah@example.com",
                    status: "Active",
                    joined: "3 weeks ago",
                    earned: 89.25,
                  },
                  {
                    name: "David Lee",
                    email: "david@example.com",
                    status: "Active",
                    joined: "1 month ago",
                    earned: 215.0,
                  },
                ].map((referral, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{referral.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {referral.email} • Joined {referral.joined}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge
                        variant={
                          referral.status === "Active"
                            ? "success"
                            : "warning"
                        }
                      >
                        {referral.status}
                      </Badge>
                      <p className="font-semibold text-sm">
                        {formatCurrency(referral.earned)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  q: "How long does it take to earn commissions?",
                  a: "Commissions are calculated instantly when your referral completes a transaction.",
                },
                {
                  q: "When can I withdraw my earnings?",
                  a: "You can withdraw when your pending balance reaches $10. Withdrawals are processed within 1-3 business days.",
                },
                {
                  q: "Is there a limit to how much I can earn?",
                  a: "No, there's no limit to referral earnings. The more you refer, the more you earn!",
                },
                {
                  q: "Can I change my referral link?",
                  a: "Your referral link is unique to your account and cannot be changed. Share it confidently!",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="border-b border-border last:border-b-0 pb-4 last:pb-0"
                  variants={staggerItem}
                >
                  <p className="font-semibold mb-2 text-sm">{item.q}</p>
                  <p className="text-sm text-muted-foreground">{item.a}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
