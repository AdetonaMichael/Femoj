"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button, Card, CardContent, CardHeader, CardTitle, Container, Input } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "@/schemas";
import { toast } from "sonner";

export default function ContactPage() {
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      toast.success("Message sent! We'll get back to you soon.");
      form.reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

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
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>
          </Container>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          className="py-20 md:py-32"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="show">
                <motion.div variants={staggerItem}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" />
                        Email
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-2">
                        For general inquiries
                      </p>
                      <a
                        href="mailto:hello@femoj.com"
                        className="text-primary font-medium hover:underline"
                      >
                        hello@femoj.com
                      </a>
                      <p className="text-muted-foreground text-sm mt-4">
                        For support
                      </p>
                      <a
                        href="mailto:support@femoj.com"
                        className="text-primary font-medium hover:underline"
                      >
                        support@femoj.com
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary" />
                        Phone
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-2">
                        Monday - Friday, 9am - 6pm EST
                      </p>
                      <a
                        href="tel:+1234567890"
                        className="text-primary font-medium hover:underline"
                      >
                        +1 (234) 567-890
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Office
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        123 Tech Street<br />
                        San Francisco, CA 94105<br />
                        United States
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        Live Chat
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Chat with us in real-time
                      </p>
                      <Button fullWidth variant="outline">
                        Start Live Chat
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                className="lg:col-span-2"
                variants={staggerItem}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Name
                        </label>
                        <Input
                          placeholder="Your name"
                          {...form.register("name")}
                        />
                        {form.formState.errors.name && (
                          <p className="text-xs text-danger mt-1">
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                          <p className="text-xs text-danger mt-1">
                            {form.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Subject
                        </label>
                        <Input
                          placeholder="How can we help?"
                          {...form.register("subject")}
                        />
                        {form.formState.errors.subject && (
                          <p className="text-xs text-danger mt-1">
                            {form.formState.errors.subject.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Message
                        </label>
                        <textarea
                          className="input-base w-full min-h-[200px] p-3 rounded-lg"
                          placeholder="Tell us more..."
                          {...form.register("message")}
                        />
                        {form.formState.errors.message && (
                          <p className="text-xs text-danger mt-1">
                            {form.formState.errors.message.message}
                          </p>
                        )}
                      </div>

                      <Button type="submit" fullWidth className="gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </Container>
        </motion.section>

        {/* Response Time */}
        <motion.section
          className="py-16 bg-muted/50"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <Container>
            <motion.div
              className="text-center max-w-2xl mx-auto"
              variants={staggerItem}
            >
              <h3 className="text-2xl font-bold mb-2">Average Response Time</h3>
              <p className="text-muted-foreground">
                We typically respond to inquiries within 2 hours during business hours. For urgent matters, please call our support line.
              </p>
            </motion.div>
          </Container>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
