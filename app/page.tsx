"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { AnimatedEnvelope } from "@/components/landing/animated-envelope";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf8f5] overflow-hidden">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-[#faf8f5]/80"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--wax-seal)] to-[#6a0000] flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-serif">L</span>
            </div>
            <span className="font-serif text-lg text-[var(--ink-primary)] tracking-wide">
              {APP_NAME}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-[var(--ink-secondary)] hover:text-[var(--wax-seal)] transition-colors font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm bg-[var(--wax-seal)] hover:bg-[#7a0000] text-white px-4 py-2 rounded-full transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Two Column Layout */}
      <section className="relative min-h-screen flex items-center px-6 pt-24 pb-16">
        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute top-1/4 left-10 w-64 h-64 bg-[var(--envelope-tan)] rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-1/4 right-10 w-96 h-96 bg-[var(--wax-seal)] rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text Content */}
            <div className="order-2 lg:order-1">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[var(--envelope-tan)]/30 rounded-full px-4 py-2 mb-8 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[var(--wax-seal)] animate-pulse" />
                <span className="text-sm text-[var(--ink-secondary)]">
                  {APP_TAGLINE}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-[var(--ink-primary)] mb-6 leading-tight tracking-tight"
              >
                Words that{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">matter</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-2 sm:h-3 bg-[var(--envelope-tan)]/30 -z-0"
                    style={{ originX: 0 }}
                  />
                </span>
                ,
                <br />
                <span className="text-[var(--wax-seal)]">delivered with care</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg sm:text-xl lg:text-2xl text-[var(--ink-secondary)] mb-10 leading-relaxed font-light max-w-xl"
              >
                Create your personal letter page and receive heartfelt messages
                from friends, family, and admirers.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 items-start"
              >
                <Link
                  href="/register"
                  className="group relative inline-flex items-center gap-3 bg-[var(--wax-seal)] hover:bg-[#7a0000] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all text-lg font-medium overflow-hidden"
                >
                  <span className="relative z-10">Create Your Letter Page</span>
                  <motion.span
                    className="relative z-10"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Link>

                <span className="text-[var(--ink-faded)] text-sm self-center">
                  Free forever
                </span>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-[var(--ink-faded)] text-sm"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>Private & Secure</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-[var(--ink-faded)]" />
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Anonymous Senders</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-[var(--ink-faded)]" />
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <span>Personal Link</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Envelope Animation */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                {/* Decorative glow behind envelope */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--envelope-tan)]/20 to-[var(--wax-seal)]/10 rounded-full blur-3xl scale-150" />
                <div className="relative">
                  <AnimatedEnvelope />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-[var(--ink-faded)]/30 flex justify-center pt-2"
          >
            <div className="w-1 h-2 rounded-full bg-[var(--ink-faded)]/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* How it works Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#faf8f5] to-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-[var(--wax-seal)] text-sm font-medium tracking-widest uppercase mb-4"
            >
              How It Works
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-serif text-[var(--ink-primary)] mb-6"
            >
              Three Simple Steps
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-[var(--ink-secondary)] max-w-2xl mx-auto"
            >
              Create your personal letter page in seconds and start receiving
              heartfelt messages.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "1",
                title: "Create Your Page",
                description:
                  "Sign up and choose your unique username. Your personal letter link will be lettrly.com/yourname.",
              },
              {
                step: "2",
                title: "Share Your Link",
                description:
                  "Share your letter link with friends, on social media, or anywhere you want to receive messages.",
              },
              {
                step: "3",
                title: "Receive Letters",
                description:
                  "Check your inbox for heartfelt letters. Writers can choose to stay anonymous or sign their name.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--wax-seal)] text-white flex items-center justify-center text-xl font-serif mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-serif text-[var(--ink-primary)] mb-3">
                  {item.title}
                </h3>
                <p className="text-[var(--ink-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-[var(--wax-seal)] text-sm font-medium tracking-widest uppercase mb-4"
            >
              Why Lettrly
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-serif text-[var(--ink-primary)] mb-6"
            >
              The Art of Thoughtful Words
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-[var(--ink-secondary)] max-w-2xl mx-auto"
            >
              There&apos;s something special about taking time to compose your
              thoughts. A letter carries weight that instant messages
              can&apos;t match.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
                title: "Completely Private",
                description:
                  "Your letters are delivered directly and securely. Only you can read them.",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Anonymous Senders",
                description:
                  "Letter writers can choose to stay anonymous. Sometimes the best words come without a name.",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Take Your Time",
                description:
                  "No character limits, no rush. Writers can craft their message thoughtfully.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative bg-[#faf8f5] rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="absolute top-0 left-8 w-16 h-1 bg-gradient-to-r from-[var(--envelope-tan)] to-[var(--wax-seal)] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[var(--wax-seal)] mb-6">{feature.icon}</div>
                <h3 className="text-xl font-serif text-[var(--ink-primary)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--ink-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial/Quote Section */}
      <section className="py-24 px-6 bg-[var(--paper-bg)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(transparent, transparent 31px, #e5e5e5 31px, #e5e5e5 32px)",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <div className="text-6xl text-[var(--envelope-tan)] mb-6 font-serif">
            &ldquo;
          </div>
          <blockquote className="text-2xl md:text-3xl font-serif text-[var(--ink-primary)] leading-relaxed mb-8 italic">
            The best letters are the ones written from the heart, not the head.
            They speak truths we sometimes can&apos;t say out loud.
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-0.5 bg-[var(--envelope-tan)]" />
            <span className="text-[var(--ink-faded)] text-sm tracking-widest uppercase">
              Write Your Story
            </span>
            <div className="w-12 h-0.5 bg-[var(--envelope-tan)]" />
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-gradient-to-b from-white to-[#faf8f5]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--ink-primary)] mb-6">
            Ready to receive letters?
          </h2>
          <p className="text-lg text-[var(--ink-secondary)] mb-10">
            Create your personal letter page today. It only takes a minute.
          </p>

          <Link
            href="/register"
            className="group relative inline-flex items-center gap-3 bg-[var(--ink-primary)] hover:bg-[var(--wax-seal)] text-white px-10 py-5 rounded-full shadow-lg hover:shadow-2xl transition-all text-xl font-medium"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <span>Get Started Free</span>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--wax-seal)] to-[#6a0000] flex items-center justify-center">
              <span className="text-white text-xs font-serif">L</span>
            </div>
            <span className="text-sm text-[var(--ink-faded)]">{APP_NAME}</span>
          </div>

          <p className="text-sm text-[var(--ink-faded)]">
            Made with care for meaningful connections
          </p>

          <div className="flex items-center gap-6 text-sm text-[var(--ink-faded)]">
            <Link
              href="/login"
              className="hover:text-[var(--wax-seal)] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="hover:text-[var(--wax-seal)] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
