import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimePreview } from "./components/AnimePreview";
import { AnimeTitleText } from "./components/AnimeTitleText";
import { useMousePosition } from "./hooks/useMousePosition";
import { ANIME_TITLES } from "./lib/constant";
import { AnimeSceneEntry, data } from "./lib/data";
import "./App.css";
import { Toaster } from "sonner";

const Page = () => {
  const [hoveredText, setHoveredText] = useState<string | null>(null);
  const [titlePosition, setTitlePosition] = useState<{ x: number; y: number } | null>(null);
  const [showMobileHint, setShowMobileHint] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const mousePosition = useMousePosition();
  const titlesContainerRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Update title position when hoveredText changes (for mobile positioning)
  useEffect(() => {
    if (hoveredText && window.innerWidth < 768) {
      const titleElement = titleRefs.current[hoveredText];
      if (titleElement) {
        // Calculate position relative to viewport center for proper centering
        const titleRect = titleElement.getBoundingClientRect();
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;
        
        // Position relative to viewport center (0,0 is center of screen)
        setTitlePosition({
          x: titleRect.left + titleRect.width / 2 - viewportCenterX,
          y: titleRect.top + titleRect.height / 2 - viewportCenterY,
        });
      }
    } else {
      setTitlePosition(null);
    }
  }, [hoveredText]);

  // Check if mobile and handle mobile hint
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileHint(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-hide mobile hint after 3 seconds
  useEffect(() => {
    if (isMobile && showMobileHint) {
      const timer = setTimeout(() => {
        setShowMobileHint(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, showMobileHint]);

  // Close previews when tapping outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: TouchEvent | MouseEvent) => {
      if (
        hoveredText &&
        titlesContainerRef.current &&
        !titlesContainerRef.current.contains(event.target as Node) &&
        window.innerWidth < 768 // Only on mobile
      ) {
        setHoveredText(null);
      }
    };

    // Use touchstart for mobile, click for desktop
    if (window.innerWidth < 768) {
      document.addEventListener("touchstart", handleClickOutside);
      return () => document.removeEventListener("touchstart", handleClickOutside);
    }
  }, [hoveredText]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-6 sm:py-8 md:py-10 lg:py-12">
      <Toaster position="top-center" richColors />
      
      {/* Mobile Hint Message */}
      <AnimatePresence>
        {isMobile && showMobileHint && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.5, 
              y: -50,
              filter: "blur(10px)",
              x: "-50%"
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              filter: "blur(0px)",
              x: "-50%",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 0.8
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              y: -30,
              filter: "blur(5px)",
              x: "-50%",
              transition: {
                duration: 0.4,
                ease: "easeInOut"
              }
            }}
            className="fixed top-4 left-1/2 z-50 md:hidden"
          >
            <div className="relative">
              {/* Glowing background effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-xl animate-pulse" />
              
              {/* Main message card */}
              <motion.div 
                className="relative rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 px-4 py-2.5 overflow-hidden whitespace-nowrap"
                animate={{
                  boxShadow: [
                    "0 0 25px rgba(168, 85, 247, 0.4), 0 0 50px rgba(168, 85, 247, 0.2)",
                    "0 0 30px rgba(236, 72, 153, 0.5), 0 0 60px rgba(236, 72, 153, 0.3)",
                    "0 0 25px rgba(59, 130, 246, 0.4), 0 0 50px rgba(59, 130, 246, 0.2)",
                    "0 0 25px rgba(168, 85, 247, 0.4), 0 0 50px rgba(168, 85, 247, 0.2)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Animated shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{
                    x: ["-100%", "200%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut"
                  }}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="relative flex items-center gap-3 z-10"
                >
                  {/* Icon */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="text-lg"
                  >
                    👆
                  </motion.div>
                  
                  {/* Message text */}
                  <p className="text-xs font-semibold text-white/95 tracking-wide">
                    Tap any title to explore scenes
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Anime Titles */}
      <div 
        ref={titlesContainerRef}
        className="flex w-full max-w-5xl flex-col items-center justify-center gap-2 sm:gap-3 md:gap-3.5 lg:gap-4"
      >
        {ANIME_TITLES.map((title) => (
          <AnimeTitleText
            key={title.id}
            title={title}
            onHover={setHoveredText}
            onHoverEnd={() => setHoveredText(null)}
            isHovered={hoveredText === title.id}
            ref={(el: HTMLDivElement | null) => {
              titleRefs.current[title.id] = el;
            }}
          />
        ))}
      </div>

      {/* Preview Images */}
      <AnimatePresence>
        {hoveredText &&
          data[hoveredText].map((item: AnimeSceneEntry, index: number) => (
            <AnimePreview
              key={index}
              hoveredText={hoveredText}
              item={item}
              index={index}
              mousePosition={mousePosition}
              titlePosition={titlePosition}
            />
          ))}
      </AnimatePresence>
    </div>
  );
};

export default Page;
