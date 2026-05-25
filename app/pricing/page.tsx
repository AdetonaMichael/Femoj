"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button, Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Container } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { PRICING_TIERS } from "@/constants";
import { formatCurrency } from "@/utils";

export default function PricingPage() {
  const features = [
    { name: "Virtual Numbers", free: "5", pro: "50", enterprise: "Unlimited" },
    { name: "SMS per Month", free: "1,000", pro: "100,000", enterprise: "Unlimited" },
    { name: "Countries", free: "10", pro: "100", enterprise: "150+" },
    { name: "API Access", free: false, pro: true, enterprise: true },
    { name: "Webhooks", free: false, pro: true, enterprise: true },
    { name: "Advanced Analytics", free: false, pro: true, enterprise: true },
    { name: "Dedicated Account Manager", free: false, pro: false, enterprise: true },
    { name: "Custom Integration", free: false, pro: false, enterprise: true },
    { name: "SLA Guarantee", free: false, pro: "99.5%", enterprise: "99.99%" },
    { name: "24/7 Support", free: false, pro: true, enterprise: true },
    { name: "Custom Branding", free: false, pro: false, enterprise: true },
    { name: "Audit Logs", free: false, pro: true, enterprise: true },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <motion.section
          className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <motion.div className="text-center max-w-3xl mx-auto" variants={staggerItem}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Transparent Pricing
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Choose the plan that fits your business. No hidden fees, no surprises.
              </p>
            </motion.div>
          </Container>
        </motion.section>

        {/* Pricing Cards */}
        <motion.section
          className="py-20 md:py-32"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {PRICING_TIERS.map((tier, idx) => (
                <motion.div
                  key={tier.id}
                  variants={staggerItem}
                  whileHover={{ y: -8 }}
                  className={`${
                    tier.featured ? "md:scale-105" : ""
                  }`}
                >
                  <Card
                    className={`h-full ${
                      tier.featured
                        ? "border-primary shadow-2xl"
                        : "hover:shadow-lg"
                    } transition-all`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <CardTitle className="text-2xl mb-2">
                            {tier.name}
                          </CardTitle>
                          <CardDescription>
                            {tier.description}
                          </CardDescription>
                        </div>
                        {tier.featured && (
                          <Badge variant="success">Popular</Badge>
                        )}
                      </div>

                      <div className="my-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold">
                            ${tier.price}
                          </span>
                          <span className="text-muted-foreground">
                            /month
                          </span>
                        </div>
                        {tier.billedAs && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {tier.billedAs}
                          </p>
                        )}
                      </div>

                      <Button
                        fullWidth
                        variant={tier.featured ? "default" : "outline"}
                        className="mb-6"
                        asChild
                      >
                        <Link href="/auth/register">Get Started</Link>
                      </Button>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold mb-3">
                            What's included:
                          </p>
                          <ul className="space-y-3">
                            {tier.features.map((feature, fidx) => (
                              <li
                                key={fidx}
                                className="flex items-center gap-3 text-sm"
                              >
                                <Check className="w-4 h-4 text-success flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </motion.section>

        {/* Comparison Table */}
        <motion.section
          className="py-20 md:py-32 bg-muted/50"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <motion.div className="text-center mb-16" variants={staggerItem}>
              <h2 className="text-4xl font-bold mb-4">
                Detailed Comparison
              </h2>
              <p className="text-xl text-muted-foreground">
                See what each plan offers
              </p>
            </motion.div>

            <motion.div
              className="overflow-x-auto"
              variants={staggerItem}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold">
                      Feature
                    </th>
                    <th className="text-center py-4 px-4 font-semibold">
                      Starter
                    </th>
                    <th className="text-center py-4 px-4 font-semibold">
                      Professional
                    </th>
                    <th className="text-center py-4 px-4 font-semibold">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4 font-medium">{feature.name}</td>
                      <td className="text-center py-4 px-4">
                        {typeof feature.free === "boolean" ? (
                          feature.free ? (
                            <Check className="w-5 h-5 text-success mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="font-medium">{feature.free}</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {typeof feature.pro === "boolean" ? (
                          feature.pro ? (
                            <Check className="w-5 h-5 text-success mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="font-medium">{feature.pro}</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {typeof feature.enterprise === "boolean" ? (
                          feature.enterprise ? (
                            <Check className="w-5 h-5 text-success mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="font-medium">{feature.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </Container>
        </motion.section>

        {/* FAQ */}
        <motion.section
          className="py-20 md:py-32"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <motion.div className="text-center mb-16" variants={staggerItem}>
              <h2 className="text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <motion.div
              className="max-w-3xl mx-auto space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {[
                {
                  q: "Can I change plans anytime?",
                  a: "Yes! Upgrade or downgrade anytime. Changes take effect at the next billing cycle.",
                },
                {
                  q: "Is there a setup fee?",
                  a: "No setup fees. You only pay for the plan you choose, with no hidden charges.",
                },
                {
                  q: "Do you offer discounts for annual billing?",
                  a: "Yes! Save 20% with annual billing on all plans.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, bank transfers, and cryptocurrency.",
                },
                {
                  q: "Is there a free trial?",
                  a: "Yes! All new accounts get 14 days free with full access to the Starter plan features.",
                },
              ].map((faq, idx) => (
                <motion.div
                  key={idx}
                  className="p-6 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  variants={staggerItem}
                  whileHover={{ x: 4 }}
                >
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="py-20 md:py-32 bg-gradient-to-br from-primary/10 to-accent/10"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <motion.div
              className="text-center max-w-2xl mx-auto"
              variants={staggerItem}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to scale your business?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start free today. No credit card required.
              </p>
              <Button size="lg" asChild>
                <Link href="/auth/register">Get Started Free</Link>
              </Button>
            </motion.div>
          </Container>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
