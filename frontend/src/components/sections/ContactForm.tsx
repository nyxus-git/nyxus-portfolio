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
    <section id="contact" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-lime-400 uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get In Touch
          <div className="w-24 h-1 bg-lime-400 mx-auto mt-4 rounded-full"></div>
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl mb-12 text-center text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Let&apos;s discuss how we can work together on exciting AI and development projects.
        </motion.p>

        {submitStatus && (
          <div className={`mb-6 p-4 rounded-md text-center ${
            submitStatus.type === 'success'
              ? 'bg-green-800/50 text-green-300 border border-green-700/50 backdrop-filter backdrop-blur-lg'
              : 'bg-red-800/50 text-red-300 border border-red-700/50 backdrop-filter backdrop-blur-lg'
          }`}>
            {submitStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Contact Information & Socials */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800/50 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-xl border border-gray-700/50 h-full flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold mb-6 text-white uppercase">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center text-white">
                  <div className="w-12 h-12 bg-lime-600/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6 text-lime-400" />
                  </div>
                  <div>
                    <p className="text-sm uppercase text-gray-400">Phone</p>
                    <p className="text-lg font-semibold text-white">+91 9356216808</p>
                  </div>
                </div>
                <div className="flex items-center text-white">
                  <div className="w-12 h-12 bg-lime-600/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-lime-400" />
                  </div>
                  <div>
                    <p className="text-sm uppercase text-gray-400">Location</p>
                    <p className="text-lg font-semibold text-white">Pune, Maharashtra</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-bold mb-6 text-white uppercase">Connect With Me</h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                    style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.2)'
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <link.icon className={`w-6 h-6 ${link.color}`} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Send Message Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800/50 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-xl border border-gray-700/50"
          >
            <h3 className="text-xl font-bold mb-6 text-white uppercase">Send Message</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-lime-400 focus:border-lime-400"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder=""
                            {...field}
                            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-lime-400 focus:border-lime-400"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-lime-400 focus:border-lime-400"
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder=""
                          className="min-h-[180px] bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-lime-400 focus:border-lime-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold py-3 px-6 rounded-md text-lg shadow-md hover:shadow-lg transition-all duration-300"
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