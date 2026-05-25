"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Introduction",
      content:
        "Femoj ('we' or 'us' or 'our') operates the femoj.com website (hereinafter referred to as the 'Service'). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.",
    },
    {
      title: "2. Information Collection and Use",
      content:
        "We collect several different types of information for various purposes to provide and improve our Service to you.",
      items: [
        "Personal Data: While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you.",
        "Usage Data: We may also collect information on how the Service is accessed and used.",
        "Cookies: We use cookies and similar tracking technologies to track activity on our Service and we hold certain information.",
      ],
    },
    {
      title: "3. Types of Data Collected",
      content:
        "Personal Data may include, but is not limited to:",
      items: [
        "Email address",
        "First name and last name",
        "Phone number",
        "Address, State, Province, ZIP/Postal code, City",
        "Cookies and Usage Data",
      ],
    },
    {
      title: "4. Use of Data",
      content:
        "Femoj uses the collected data for various purposes:",
      items: [
        "To provide and maintain the Service",
        "To notify you about changes to our Service",
        "To provide customer support",
        "To gather analysis or valuable information so that we can improve our Service",
        "To monitor the usage of our Service",
        "To detect, prevent and address technical and security issues",
      ],
    },
    {
      title: "5. Security of Data",
      content:
        "The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.",
    },
    {
      title: "6. Children's Privacy",
      content:
        "Our Service does not address anyone under the age of 18 ('Children'). We do not knowingly collect personally identifiable information from anyone under 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us.",
    },
    {
      title: "7. Changes to This Privacy Policy",
      content:
        "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'effective date' at the top of this Privacy Policy.",
    },
    {
      title: "8. Contact Us",
      content:
        "If you have any questions about this Privacy Policy, please contact us at privacy@femoj.com",
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
                Privacy Policy
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
