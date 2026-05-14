import { type ReactNode, type CSSProperties } from "react";
import { motion, type Variants, type MotionProps } from "framer-motion";

// ─── Animation Presets (Variants) ───

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ─── Hover Presets ───
export const hoverScale = {
  whileHover: { scale: 1.03, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
};

export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
  whileTap: { y: 0 },
};

export const hoverGlow = (color: string) => ({
  whileHover: {
    boxShadow: `0 0 20px ${color}30, 0 0 60px ${color}10`,
    transition: { duration: 0.3 },
  },
});

// ─── Wrapper Components ───

interface AnimatedProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
}

type MotionDivProps = AnimatedProps & Omit<MotionProps, "children" | "style">;

/** Fade in when scrolled into view */
export function FadeIn({ children, className, style, delay = 0, ...rest }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, delay, ease: "easeOut" } },
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Slide up + fade in when scrolled into view */
export function SlideUp({ children, className, style, delay = 0, ...rest }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] } },
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Stagger children animations */
export function StaggerGroup({ children, className, style, delay = 0, ...rest }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: delay },
        },
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Individual stagger item */
export function StaggerItem({ children, className, style, ...rest }: Omit<MotionDivProps, "delay">) {
  return (
    <motion.div
      variants={staggerItem}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Scale in animation */
export function ScaleIn({ children, className, style, delay = 0, ...rest }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] } },
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Page transition wrapper */
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}