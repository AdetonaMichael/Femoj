"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button, Container } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import { Users, Target, Zap, Award, Lightbulb, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
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
                About Femoj
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Empowering businesses worldwide with seamless, affordable virtual communication solutions.
              </p>
            </motion.div>
          </Container>
        </motion.section>

        {/* Mission & Vision */}
        <motion.section
          className="py-20 md:py-32"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div variants={staggerItem}>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  To provide the world's most accessible and affordable virtual communication platform, enabling businesses of all sizes to scale their operations globally without geographical limitations.
                </p>
                <p className="text-lg text-muted-foreground">
                  We believe communication should be frictionless, secure, and available to everyone, everywhere.
                </p>
              </motion.div>
              <motion.div variants={staggerItem}>
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  To become the global leader in virtual communication services, trusted by millions of businesses and users worldwide.
                </p>
                <p className="text-lg text-muted-foreground">
                  Creating a world where distance is irrelevant and communication is instant, reliable, and affordable.
                </p>
              </motion.div>
            </div>
          </Container>
        </motion.section>

        {/* Values */}
        <motion.section
          className="py-20 md:py-32 bg-muted/50"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <motion.div className="text-center mb-16" variants={staggerItem}>
              <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
              <p className="text-xl text-muted-foreground">
                These principles guide everything we do
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {[
                {
                  icon: Target,
                  title: "Customer First",
                  description: "Every decision we make is driven by our customers' needs",
                },
                {
                  icon: Zap,
                  title: "Innovation",
                  description: "Constantly evolving to stay ahead of the curve",
                },
                {
                  icon: Award,
                  title: "Reliability",
                  description: "99.9% uptime with 24/7 world-class support",
                },
                {
                  icon: Lightbulb,
                  title: "Simplicity",
                  description: "Making complex problems simple and intuitive",
                },
                {
                  icon: Heart,
                  title: "Transparency",
                  description: "Clear pricing and honest communication always",
                },
                {
                  icon: Users,
                  title: "Community",
                  description: "Building a supportive ecosystem for all users",
                },
              ].map((value, idx) => (
                <motion.div
                  key={idx}
                  className="p-6 rounded-lg border border-border hover:shadow-lg transition-shadow"
                  variants={staggerItem}
                  whileHover={{ y: -4 }}
                >
                  <value.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </motion.section>

        {/* Team */}
        <motion.section
          className="py-20 md:py-32"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <motion.div className="text-center mb-16" variants={staggerItem}>
              <h2 className="text-4xl font-bold mb-4">Our Team</h2>
              <p className="text-xl text-muted-foreground">
                Passionate technologists solving real-world problems
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {[
                {
                  name: "Alex Johnson",
                  role: "CEO & Co-founder",
                  bio: "Former VP of Engineering at TechCorp",
                },
                {
                  name: "Sarah Chen",
                  role: "CTO & Co-founder",
                  bio: "10+ years in distributed systems",
                },
                {
                  name: "Marcus Williams",
                  role: "VP of Operations",
                  bio: "Built operations at 3 scale-ups",
                },
                {
                  name: "Emma Davis",
                  role: "VP of Product",
                  bio: "Passionate about user experience",
                },
                {
                  name: "James Wilson",
                  role: "Head of Sales",
                  bio: "B2B SaaS sales expert",
                },
                {
                  name: "Lisa Anderson",
                  role: "Head of Support",
                  bio: "Customer success champion",
                },
              ].map((member, idx) => (
                <motion.div
                  key={idx}
                  className="text-center p-6 rounded-lg border border-border hover:shadow-lg transition-shadow"
                  variants={staggerItem}
                  whileHover={{ y: -4 }}
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mb-2">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </motion.section>

        {/* Stats */}
        <motion.section
          className="py-20 md:py-32 bg-gradient-to-br from-primary/10 to-accent/10"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {[
                { value: "500K+", label: "Users" },
                { value: "150+", label: "Countries" },
                { value: "99.9%", label: "Uptime" },
                { value: "2M+", label: "Messages Daily" },
              ].map((stat, idx) => (
                <motion.div key={idx} variants={staggerItem}>
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="py-20 md:py-32"
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
                Ready to get started?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of businesses using Femoj to scale globally
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/auth/register"
                  className="inline-flex items-center justify-center rounded-lg font-medium transition-colors px-6 py-3 text-lg h-12 bg-primary text-white hover:bg-primary/90 active:bg-primary/80"
                >
                  Start Free Trial
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg font-medium transition-colors px-6 py-3 text-lg h-12 border border-input bg-background hover:bg-muted active:bg-muted/80"
                >
                  Contact Sales
                </a>
              </div>
            </motion.div>
          </Container>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
