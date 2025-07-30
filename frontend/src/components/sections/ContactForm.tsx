// frontend/src/components/sections/ContactForm.tsx
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
// Import the API function to send the message
import { sendContactMessage, type ContactFormData } from "@/lib/api";

// Define the form schema using Zod for validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Initialize the form using react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      // Call the API function to send the message
      // --- CORRECTED TYPE HANDLING FOR ERROR OBJECT ---
      const response = await sendContactMessage(values as ContactFormData);
      console.log("Message sent successfully:", response);
      setSubmitStatus({ type: 'success', message: response.message || "Your message has been sent successfully!" });
      form.reset(); // Clear the form on success
      // --- END CORRECTION ---
    } catch (err: unknown) { // Use 'unknown' for better type safety
      console.error("Error sending message:", err);
      // --- IMPROVED ERROR MESSAGE HANDLING ---
      let errorMessage = "Failed to send your message. Please try again.";
      if (err instanceof Error) {
        // If it's a standard JavaScript Error object
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        // If it's an object with a 'message' property (e.g., API response error)
        errorMessage = (err as { message: string }).message;
      } else if (typeof err === 'string') {
        // If it's a string error message
        errorMessage = err;
      }
      setSubmitStatus({
        type: 'error',
        message: errorMessage,
      });
      // --- END IMPROVEMENT ---
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-2xl">
        <motion.h2
          className="text-3xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get In Touch
        </motion.h2>

        {submitStatus && (
          <div className={`mb-6 p-4 rounded-md ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {submitStatus.message}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell me about your project or just say hello!"
                        className="min-h-[180px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
}