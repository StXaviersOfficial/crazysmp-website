"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// Shared transition
const sharedTransition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

// CRITICAL: y offset of 0 in exit animation. Previously y:20 made the button
// appear to "scroll down" with the page during exit. Now opacity-only.
const sharedInitial = { opacity: 0, scale: 0.85 };
const sharedAnimate = { opacity: 1, scale: 1 };
const sharedExit = { opacity: 0, scale: 0.85 };

export function DiscordFab() {
  const [mounted, setMounted] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const [fabVisible, setFabVisible] = React.useState(true);

  // Only render on client (for portal)
  React.useEffect(() => setMounted(true), []);

  // Show popup 3 seconds after mount
  React.useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => setShowPopup(true), 3000);
    return () => clearTimeout(t);
  }, [dismissed]);

  // Lock body scroll while popup is open
  React.useEffect(() => {
    if (showPopup) {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = `-${scrollX}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      const preventKeyboardScroll = (e: KeyboardEvent) => {
        const scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
        if (scrollKeys.includes(e.key)) e.preventDefault();
      };
      document.addEventListener("keydown", preventKeyboardScroll);

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        window.scrollTo(scrollX, scrollY);
        document.removeEventListener("keydown", preventKeyboardScroll);
      };
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [showPopup]);

  // Hide on scroll, reappear 400ms after scroll stops
  React.useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout>;
    let isScrolling = false;

    const onScroll = () => {
      if (showPopup) return;
      if (!isScrolling) {
        setFabVisible(false);
        isScrolling = true;
      }
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setFabVisible(true);
        isScrolling = false;
      }, 400);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimer);
    };
  }, [showPopup]);

  // Force FAB visible while popup is open
  React.useEffect(() => {
    if (showPopup) setFabVisible(true);
  }, [showPopup]);

  const dismissPopup = () => {
    setShowPopup(false);
    setDismissed(true);
  };

  if (!mounted) return null;

  // Use createPortal to render FAB directly on document.body — escapes any
  // transformed ancestor (which would break position: fixed).
  return createPortal(
    <>
      <style>{`
        .csmp-discord-fab-btn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #5865F2, #4752C4);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px -4px rgba(88, 101, 242, 0.6), 0 0 0 1px rgba(88, 101, 242, 0.3);
          transition: transform 0.3s ease;
          cursor: pointer;
          will-change: transform, opacity;
        }
        .csmp-discord-fab-popup {
          position: fixed;
          inset: 0;
          z-index: 99998;
          background: rgba(2, 6, 15, 0.45);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          pointer-events: auto;
          cursor: pointer;
        }
        .csmp-discord-fab-popup-text {
          position: fixed;
          bottom: 100px;
          right: 24px;
          background: rgba(15, 33, 71, 0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(88, 101, 242, 0.5);
          border-radius: 16px;
          padding: 16px 18px;
          max-width: 280px;
          box-shadow:
            0 0 60px -8px rgba(88, 101, 242, 0.6),
            0 16px 48px -12px rgba(0, 0, 0, 0.9);
          cursor: default;
          pointer-events: none;
        }
        .csmp-discord-fab-popup-x {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          pointer-events: auto;
        }
      `}</style>

      {/* Popup overlay with blur */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="csmp-discord-fab-popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={sharedTransition}
            onClick={dismissPopup}
          >
            <motion.div
              className="csmp-discord-fab-popup-text"
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={sharedTransition}
            >
              <button
                onClick={(e) => { e.stopPropagation(); dismissPopup(); }}
                aria-label="Dismiss popup"
                className="csmp-discord-fab-popup-x"
              >
                <X className="h-3 w-3" />
              </button>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                Need help or want to chat with the community?{" "}
                <a
                  href="https://discord.gg/GFzAeUj7TJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                  style={{ color: "#A5B4FC" }}
                  onClick={dismissPopup}
                >
                  Join our Discord
                </a>{" "}
                for the fastest response.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circular Discord FAB — z-index 99999 (above everything, true fixed) */}
      <AnimatePresence>
        {fabVisible && (
          <motion.div
            style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 99999 }}
            initial={sharedInitial}
            animate={sharedAnimate}
            exit={sharedExit}
            transition={sharedTransition}
          >
            <motion.a
              href="https://discord.gg/GFzAeUj7TJ"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join our Discord server"
              title="Join our Discord server — fastest way to reach us"
              className="csmp-discord-fab-btn"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <DiscordLogo className="h-8 w-8 text-white" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}

/* Official Discord logo (SVG) */
export function DiscordLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.317 4.369C18.777 3.699 17.135 3.213 15.429 2.948C15.213 3.341 14.961 3.87 14.789 4.285C12.988 4.04 11.211 4.04 9.443 4.285C9.271 3.87 9.013 3.341 8.797 2.948C7.09 3.213 5.447 3.7 3.908 4.371C0.926 8.812 0.139 13.139 0.532 17.41C2.584 18.918 4.572 19.831 6.525 20.428C7.022 19.752 7.464 19.034 7.843 18.276C7.117 18.006 6.423 17.675 5.771 17.291C5.941 17.166 6.108 17.036 6.271 16.902C9.954 18.608 13.952 18.608 17.591 16.902C17.755 17.036 17.923 17.166 18.092 17.291C17.439 17.676 16.744 18.007 16.018 18.277C16.397 19.034 16.839 19.753 17.336 20.429C19.29 19.832 21.279 18.919 23.331 17.41C23.797 12.492 22.532 8.205 20.317 4.369ZM8.318 14.731C7.213 14.731 6.305 13.715 6.305 12.462C6.305 11.209 7.194 10.192 8.318 10.192C9.442 10.192 10.35 11.209 10.331 12.462C10.331 13.715 9.442 14.731 8.318 14.731ZM15.914 14.731C14.809 14.731 13.901 13.715 13.901 12.462C13.901 11.209 14.79 10.192 15.914 10.192C17.038 10.192 17.946 11.209 17.927 12.462C17.927 13.715 17.038 14.731 15.914 14.731Z" />
    </svg>
  );
}
