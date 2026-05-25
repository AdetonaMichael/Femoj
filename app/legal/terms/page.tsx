"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using Femoj, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
    },
    {
      title: "2. Use License",
      content:
        "Permission is granted to temporarily download one copy of the materials (information or software) on Femoj's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
      items: [
        "Modifying or copying the materials",
        "Using the materials for any commercial purpose or for any public display",
        "Attempting to decompile or reverse engineer any software contained on the website",
        "Removing any copyright or other proprietary notations from the materials",
        "Transferring the materials to another person or 'mirroring' the materials on any other server",
      ],
    },
    {
      title: "3. Disclaimer",
      content:
        "The materials on Femoj's website are provided on an 'as is' basis. Femoj makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
    },
    {
      title: "4. Limitations",
      content:
        "In no event shall Femoj or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Femoj's website.",
    },
    {
      title: "5. Accuracy of Materials",
      content:
        "The materials appearing on Femoj's website could include technical, typographical, or photographic errors. Femoj does not warrant that any of the materials on its website are accurate, complete, or current. Femoj may make changes to the materials contained on its website at any time without notice.",
    },
    {
      title: "6. Links",
      content:
        "Femoj has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Femoj of the site. Use of any such linked website is at the user's own risk.",
    },
    {
      title: "7. Modifications",
      content:
        "Femoj may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.",
    },
    {
      title: "8. Governing Law",
      content:
        "These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <motion.section
          className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <motion.div className="max-w-3xl" variants={staggerItem}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: January 2024
              </p>
            </motion.div>
          </Container>
        </motion.section>

        <motion.section
          className="py-20 md:py-32"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <motion.div className="max-w-3xl space-y-12" variants={staggerContainer} initial="hidden" animate="show">
              {sections.map((section, idx) => (
                <motion.div key={idx} variants={staggerItem} className="space-y-4">
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                  {section.items && (
                    <ul className="space-y-2 ml-4">
                      {section.items.map((item, iidx) => (
                        <li
                          key={iidx}
                          className="text-muted-foreground leading-relaxed list-disc"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
