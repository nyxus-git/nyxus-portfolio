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

import { Phone, MapPin, Youtube, Linkedin, Github, X } from 'lucide-react';

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
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
      setSubmitStatus({ type: 'success', message: response.message || "Your message has been sent successfully!" });
      form.reset();
    } catch (err: unknown) {
      console.error("Error sending message:", err);
      let errorMessage = "Failed to send your message. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = (err as { message: string }).message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setSubmitStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const socialLinks = [
    { name: "YouTube", icon: Youtube, url: "https://www.youtube.com/@nyxus-linux", color: "text-red-500" },
    { name: "LeetCode", icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.875 16.5h-2.1c-.825 0-1.5-.675-1.5-1.5v-6c0-.825.675-1.5 1.5-1.5h2.1c.825 0 1.5.675 1.5 1.5v6c0 .825-.675 1.5-1.5 1.5zm6-1.5h-2.1c-.825 0-1.5-.675-1.5-1.5v-6c0-.825.675-1.5 1.5-1.5h2.1c.825 0 1.5.675 1.5 1.5v6c0 .825-.675 1.5-1.5 1.5z"></path>
      </svg>
    ), url: "https://leetcode.com/u/nyxus-dsa/", color: "text-orange-500" },
    { name: "GitHub", icon: Github, url: "https://github.com/nyxus-git", color: "text-gray-400" },
    { name: "X (Twitter)", icon: X, url: "https://x.com/NyxusXplore", color: "text-blue-400" },
    { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/nyxus-link/", color: "text-blue-500" },
  ];

  return (
    <section id="contact" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
            Get In Touch
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Let&apos;s discuss how we can work together on exciting AI and development projects.
          </p>
        </motion.div>

        {submitStatus && (
          <div className={`mb-8 p-4 rounded-xl text-center font-medium ${
            submitStatus.type === 'success'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {submitStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 md:p-10 rounded-3xl flex flex-col justify-between h-full"
          >
            <div>
              <h3 className="text-xl font-bold mb-8 text-white">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-center text-white group">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mr-6 border border-white/10 group-hover:border-primary/50 transition-colors">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Phone</p>
                    <p className="text-lg font-medium text-white group-hover:text-primary transition-colors">+91 9356216808</p>
                  </div>
                </div>
                <div className="flex items-center text-white group">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mr-6 border border-white/10 group-hover:border-primary/50 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Location</p>
                    <p className="text-lg font-medium text-white group-hover:text-primary transition-colors">Pune, Maharashtra</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-lg font-bold mb-6 text-white">Connect With Me</h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <link.icon className={`w-5 h-5 ${link.color}`} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 md:p-10 rounded-3xl"
          >
            <h3 className="text-xl font-bold mb-8 text-white">Send Message</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-black/20 border-white/10 text-white focus:ring-primary focus:border-primary rounded-xl h-12"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            className="bg-black/20 border-white/10 text-white focus:ring-primary focus:border-primary rounded-xl h-12"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-400">Subject</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-black/20 border-white/10 text-white focus:ring-primary focus:border-primary rounded-xl h-12"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-400">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[160px] bg-black/20 border-white/10 text-white focus:ring-primary focus:border-primary rounded-xl resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl text-base transition-transform active:scale-[0.98]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}