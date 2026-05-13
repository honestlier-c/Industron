/** Shared Framer Motion animation variants — import from here instead of redefining per file */

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 },
  }),
}

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
