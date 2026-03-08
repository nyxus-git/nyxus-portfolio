"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { sendContactMessage, type ContactFormData } from "@/lib/api";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
  User,
  AtSign,
  Tag,
  MessageSquare,
  Youtube,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().optional(),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

const inputClass =
  "h-14 rounded-lg border border-[#282e39] bg-[#1c1f27] pl-12 text-white placeholder:text-[#9da6b9]/50 focus-visible:ring-0 focus-visible:border-[#135bec]";

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
      setSubmitStatus({
        type: "success",
        message: response.message || "Transmission sent successfully.",
      });
      form.reset();
    } catch (err: unknown) {
      let errorMessage = "Failed to send transmission.";
      if (err instanceof Error) errorMessage = err.message;
      setSubmitStatus({ type: "error", message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="px-4 py-16 md:px-8">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="border-b border-[#282e39] pb-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-green-500">
                System Online
              </span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
              Establish <span className="text-[#135bec]">Connection</span>
            </h2>
            <p className="mt-3 max-w-xl text-lg text-[#9da6b9]">
              Send a signal across the network. I&apos;ll respond once your data
              packet is received.
            </p>
          </div>

          {submitStatus ? (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                submitStatus.type === "success"
                  ? "border-green-500/40 bg-green-500/10 text-green-300"
                  : "border-red-500/40 bg-red-500/10 text-red-300"
              }`}
            >
              {submitStatus.message}
            </div>
          ) : null}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <p className="pb-2 text-xs font-mono uppercase tracking-wider text-white">
                        User.Name
                      </p>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-[#9da6b9]" />
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="ENTER NAME"
                            className={inputClass}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <p className="pb-2 text-xs font-mono uppercase tracking-wider text-white">
                        User.Email
                      </p>
                      <div className="relative">
                        <AtSign className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-[#9da6b9]" />
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="ENTER EMAIL ADDRESS"
                            className={inputClass}
                          />
                        </FormControl>
                      </div>
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
                    <p className="pb-2 text-xs font-mono uppercase tracking-wider text-white">
                      Subject.Protocol
                    </p>
                    <div className="relative">
                      <Tag className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-[#9da6b9]" />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="SYSTEM INQUIRY"
                          className={inputClass}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <p className="pb-2 text-xs font-mono uppercase tracking-wider text-white">
                      Message.Data
                    </p>
                    <div className="relative">
                      <MessageSquare className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-[#9da6b9]" />
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="INPUT TRANSMISSION DATA..."
                          className="min-h-40 rounded-lg border border-[#282e39] bg-[#1c1f27] pl-12 pt-4 text-white placeholder:text-[#9da6b9]/50 focus-visible:ring-0 focus-visible:border-[#135bec]"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto bg-[#135bec] px-8 py-6 text-sm font-bold uppercase tracking-widest text-white hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(19,91,236,0.5)]"
              >
                <span className="mr-2">
                  {isSubmitting ? "Transmitting..." : "Initiate Transmission"}
                </span>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Form>
        </div>

        <motion.div
          className="lg:col-span-5 flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden rounded-xl border border-[#282e39] bg-[#1c1f27] p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#135bec]/20 blur-3xl" />
            <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
              <span className="material-symbols-outlined text-[#135bec]">
                hub
              </span>
              Contact Nodes
            </h3>

            <div className="space-y-5">
              <InfoRow
                icon={<Mail className="h-5 w-5" />}
                label="Electronic Mail"
                value="rohanmane9841@gmail.com"
                href="mailto:rohanmane9841@gmail.com"
              />
              <InfoRow
                icon={<Phone className="h-5 w-5" />}
                label="Signal Line"
                value="+91 9356216808"
                href="tel:+919356216808"
              />
              <InfoRow
                icon={<MapPin className="h-5 w-5" />}
                label="Base Coordinates"
                value="Pune, Maharashtra"
              />
            </div>

            <div className="mt-8 border-t border-[#282e39] pt-6">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#9da6b9]">
                Network Links
              </h4>
              <div className="flex gap-3">
                <SocialIcon
                  href="https://github.com/nyxus-git"
                  icon={<Github className="h-5 w-5" />}
                />
                <SocialIcon
                  href="https://www.linkedin.com/in/nyxus-link/"
                  icon={<Linkedin className="h-5 w-5" />}
                />
                <SocialIcon
                  href="https://x.com/NyxusXplore"
                  icon={<X className="h-5 w-5" />}
                />
                <SocialIcon
                  href="https://www.youtube.com/@nyxus-linux"
                  icon={<Youtube className="h-5 w-5" />}
                />
              </div>
            </div>
          </div>

          <div className="relative h-64 overflow-hidden rounded-xl border border-[#282e39]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(19,91,236,0.22),transparent_55%)]" />
            <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,#2b3342_1px,transparent_1px),linear-gradient(to_bottom,#2b3342_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <span className="relative inline-flex h-4 w-4 rounded-full bg-[#135bec] border-2 border-white" />
              <div className="mt-2 rounded border border-[#282e39] bg-[#101622]/90 px-3 py-1 text-xs font-mono text-white">
                LOC: 18.5204° N, 73.8567° E
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-lg border border-[#282e39] bg-[#101622] p-2 text-[#9da6b9]">
        {icon}
      </div>
      <div>
        <p className="mb-1 text-xs font-mono uppercase tracking-wider text-[#9da6b9]">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="font-medium text-white hover:text-[#135bec]"
          >
            {value}
          </a>
        ) : (
          <p className="font-medium text-white">{value}</p>
        )}
      </div>
    </div>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#282e39] bg-[#101622] text-white transition-all hover:border-[#135bec] hover:text-[#135bec] hover:shadow-[0_0_10px_rgba(19,91,236,0.3)]"
    >
      {icon}
    </a>
  );
}
