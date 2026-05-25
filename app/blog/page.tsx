"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Container } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const articles = [
    {
      id: 1,
      title: "Getting Started with Femoj: A Complete Guide",
      description:
        "Learn how to set up your Femoj account, purchase your first virtual number, and start sending SMS in minutes.",
      author: "Sarah Chen",
      date: "2024-01-15",
      category: "Tutorial",
      readTime: "5 min read",
      featured: true,
    },
    {
      id: 2,
      title: "How to Choose the Right Virtual Number for Your Business",
      description:
        "Explore different types of virtual numbers and learn which one is best suited for your business needs.",
      author: "Alex Johnson",
      date: "2024-01-12",
      category: "Business",
      readTime: "8 min read",
      featured: true,
    },
    {
      id: 3,
      title: "SMS Marketing Best Practices: Expert Tips",
      description:
        "Master the art of SMS marketing with proven strategies to increase engagement and conversions.",
      author: "Emma Davis",
      date: "2024-01-10",
      category: "Marketing",
      readTime: "6 min read",
      featured: false,
    },
    {
      id: 4,
      title: "API Integration Guide: Connect Femoj to Your App",
      description:
        "Step-by-step guide to integrating Femoj's powerful API into your application.",
      author: "David Lee",
      date: "2024-01-08",
      category: "Development",
      readTime: "12 min read",
      featured: false,
    },
    {
      id: 5,
      title: "Global Expansion: Virtual Numbers in 150+ Countries",
      description:
        "Discover how virtual numbers can help you expand your business into new markets worldwide.",
      author: "Marcus Williams",
      date: "2024-01-05",
      category: "Growth",
      readTime: "7 min read",
      featured: false,
    },
    {
      id: 6,
      title: "Security and Compliance: How Femoj Protects Your Data",
      description:
        "Learn about the security measures and compliance standards we implement to protect your information.",
      author: "Lisa Anderson",
      date: "2024-01-01",
      category: "Security",
      readTime: "9 min read",
      featured: false,
    },
  ];

  const featured = articles.filter((a) => a.featured);
  const others = articles.filter((a) => !a.featured);

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
            <motion.div className="max-w-3xl" variants={staggerItem}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Resources & Blog
              </h1>
              <p className="text-xl text-muted-foreground">
                Learn how to get the most out of Femoj and stay updated with the latest news and tips.
              </p>
            </motion.div>
          </Container>
        </motion.section>

        {/* Featured Articles */}
        <motion.section
          className="py-20 md:py-32"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <motion.div className="mb-12" variants={staggerItem}>
              <h2 className="text-3xl font-bold mb-2">Featured Articles</h2>
              <p className="text-muted-foreground">
                Check out our most popular guides and tutorials
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {featured.map((article) => (
                <motion.div
                  key={article.id}
                  variants={staggerItem}
                  whileHover={{ y: -4 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                          {article.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {article.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-2xl">
                        {article.title}
                      </CardTitle>
                      <CardDescription>
                        {article.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between h-full">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {article.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(article.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Button variant="outline" className="gap-2">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </motion.section>

        {/* All Articles */}
        <motion.section
          className="py-20 md:py-32 bg-muted/50"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <motion.div className="mb-12" variants={staggerItem}>
              <h2 className="text-3xl font-bold mb-2">All Articles</h2>
            </motion.div>

            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {others.map((article) => (
                <motion.div
                  key={article.id}
                  className="p-6 rounded-lg border border-border hover:bg-background hover:shadow-md transition-all"
                  variants={staggerItem}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                          {article.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {article.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {article.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(article.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </motion.section>

        {/* Newsletter */}
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
              <h2 className="text-4xl font-bold mb-4">
                Subscribe to our newsletter
              </h2>
              <p className="text-muted-foreground mb-8">
                Get the latest articles, tips, and updates delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-base flex-1 px-4 py-2"
                />
                <Button>Subscribe</Button>
              </form>
            </motion.div>
          </Container>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
