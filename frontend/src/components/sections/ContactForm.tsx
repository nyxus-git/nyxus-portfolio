"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage, type ContactFormData } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Phone, MapPin, Youtube, Linkedin, Github, X, MessageSquare, Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().optional(),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await sendContactMessage(values as ContactFormData);
      console.log("Message sent successfully:", response);
      setSubmitStatus({
        type: "success",
        message: response.message || "Your message has been sent successfully!",
      });
      form.reset();
    } catch (err: unknown) {
      console.error("Error sending message:", err);
      let errorMessage = "Failed to send your message. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "message" in err) {
        errorMessage = (err as { message: string }).message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const socialLinks = [
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://www.youtube.com/@nyxus-linux",
      color: "text-rose-400",
    },
    {
      name: "LeetCode",
      icon: ({ className }: { className?: string }) => (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.875 16.5h-2.1c-.825 0-1.5-.675-1.5-1.5v-6c0-.825.675-1.5 1.5-1.5h2.1c.825 0 1.5.675 1.5 1.5v6c0 .825-.675 1.5-1.5 1.5zm6-1.5h-2.1c-.825 0-1.5-.675-1.5-1.5v-6c0-.825.675-1.5 1.5-1.5h2.1c.825 0 1.5.675 1.5 1.5v6c0 .825-.675 1.5-1.5 1.5z"></path>
        </svg>
      ),
      url: "https://leetcode.com/u/nyxus-dsa/",
      color: "text-amber-400",
    },
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/nyxus-git",
      color: "text-gray-200",
    },
    {
      name: "X (Twitter)",
      icon: X,
      url: "https://x.com/NyxusXplore",
      color: "text-primary",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/nyxus-link/",
      color: "text-accent",
    },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="section-divider mb-24" />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-primary/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[380px] h-[380px] bg-accent/10 rounded-full blur-[130px]" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <SectionHeader
          number="12"
          badge="Initiate Contact"
          icon={MessageSquare}
          title="Get In Touch"
          subtitle="Let's collaborate on intelligent systems, full-stack platforms, or open-source AI."
        />

        {submitStatus && (
          <div
            className={`mb-8 p-4 rounded-2xl text-center text-sm font-medium ${
              submitStatus.type === "success"
                ? "bg-primary/15 text-purple-200 border border-primary/35"
                : "bg-rose-500/10 text-rose-300 border border-rose-500/25"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Tile: Contact Info & Socials */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 glass-card p-8 md:p-10 rounded-3xl flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-primary">
                Direct Channels
              </span>
              <h3 className="text-2xl font-bold mt-2 mb-8 text-white">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-center text-white group">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mr-5 border border-primary/25 group-hover:border-primary/60 transition-colors">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-0.5">
                      Phone
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-white group-hover:text-primary transition-colors">
                      +91 9356216808
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-white group">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mr-5 border border-accent/25 group-hover:border-accent/60 transition-colors">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-0.5">
                      Location
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-white group-hover:text-accent transition-colors">
                      Pune, Maharashtra
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/[0.06]">
              <h3 className="text-sm font-mono uppercase tracking-[0.18em] mb-4 text-gray-400">
                Connect Across Platforms
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    title={link.name}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.04] border border-white/10 hover:border-primary/55 hover:bg-primary/15 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all"
                    whileHover={{ scale: 1.07, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <link.icon className={`w-5 h-5 ${link.color}`} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Tile: Message Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 glass-panel p-8 md:p-10 rounded-3xl"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-accent">
              Transmission
            </span>
            <h3 className="text-2xl font-bold mt-2 mb-8 text-white">Send a Message</h3>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-mono uppercase tracking-wider text-gray-400">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            {...field}
                            className="bg-[#070612]/70 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary/40 focus-visible:border-primary/60 rounded-xl h-12"
                          />
                        </FormControl>
                        <FormMessage className="text-rose-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-mono uppercase tracking-wider text-gray-400">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@domain.com"
                            {...field}
                            className="bg-[#070612]/70 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary/40 focus-visible:border-primary/60 rounded-xl h-12"
                          />
                        </FormControl>
                        <FormMessage className="text-rose-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-mono uppercase tracking-wider text-gray-400">
                        Subject
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Project inquiry, collaboration, or role"
                          {...field}
                          className="bg-[#070612]/70 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary/40 focus-visible:border-primary/60 rounded-xl h-12"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-mono uppercase tracking-wider text-gray-400">
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell me about what you're building…"
                          className="min-h-[150px] bg-[#070612]/70 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary/40 focus-visible:border-primary/60 rounded-xl resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-rose-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-13 btn-primary rounded-full text-sm uppercase tracking-widest active:scale-[0.98]"
                  disabled={isSubmitting}
                >
                  <Send size={15} />
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
