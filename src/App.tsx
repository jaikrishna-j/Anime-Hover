import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimePreview } from "./components/AnimePreview";
import { AnimeTitleText } from "./components/AnimeTitleText";
import { useMousePosition } from "./hooks/useMousePosition";
import { ANIME_TITLES } from "./lib/constant";
import { AnimeSceneEntry, data } from "./lib/data";
import "./App.css";
import { Toaster } from "sonner";
import Orb from "./components/Orb";
import ProfileCard from "./components/ProfileCard";
import BubbleMenu from "./components/BubbleMenu";

const Page = () => {
  const [hoveredText, setHoveredText] = useState<string | null>(null);
  const [titlePosition, setTitlePosition] = useState<{ x: number; y: number } | null>(null);
  const [showMobileHint, setShowMobileHint] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLaptop, setIsLaptop] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showBubbleMenu, setShowBubbleMenu] = useState(false);
  const mousePosition = useMousePosition();
  const titlesContainerRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const bubbleMenuRef = useRef<HTMLDivElement>(null);

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

  // Check device type and handle hint message
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      const laptop = width >= 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      setIsLaptop(laptop);
      
      // Show hint for all devices
      setShowMobileHint(true);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Auto-hide hint after 3 seconds
  useEffect(() => {
    if (showMobileHint) {
      const timer = setTimeout(() => {
        setShowMobileHint(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMobileHint]);

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

  // Close bubble menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        showBubbleMenu &&
        bubbleMenuRef.current &&
        !bubbleMenuRef.current.contains(event.target as Node)
      ) {
        setShowBubbleMenu(false);
      }
    };

    if (showBubbleMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }
  }, [showBubbleMenu]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-6 sm:py-8 md:py-10 lg:py-12">
      <Toaster position="top-center" richColors />
      
      {/* Device Hint Message */}
      <AnimatePresence>
        {showMobileHint && (
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
            className="fixed top-4 left-1/2 z-50"
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
                    {isMobile ? "👆" : isTablet ? "👆" : isLaptop ? "🖱️" : "🖱️"}
                  </motion.div>
                  
                  {/* Message text */}
                  <p className="text-xs sm:text-sm font-semibold text-white/95 tracking-wide">
                    {isMobile 
                      ? "Tap any title to explore scenes" 
                      : isTablet 
                      ? "Tap or hover any title to explore scenes"
                      : isLaptop
                      ? "Hover over any title to explore scenes"
                      : "Hover over any title to explore scenes"}
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

      {/* Orb at bottom center */}
      <div 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 z-10 cursor-pointer"
        onClick={() => setShowProfileCard(true)}
      >
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>

      {/* Profile Card Modal */}
      <AnimatePresence>
        {showProfileCard && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
              onClick={() => setShowProfileCard(false)}
            />
            
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div 
                className="relative w-full max-w-2xl pointer-events-auto flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <ProfileCard
                  name="Jaikrishna J"
                  title="Full-Stack Developer"
                  handle="jaicodes"
                  status="Online"
                  contactText="Contact Me"
                  avatarUrl="/JaikrishnaProfile.png"
                  showUserInfo={true}
                  enableTilt={false}
                  enableMobileTilt={false}
                  onContactClick={() => setShowBubbleMenu(true)}
                />
                {/* Close button */}
                <button
                  onClick={() => setShowProfileCard(false)}
                  className="mt-4 text-white/40 hover:text-white/60 transition-colors pointer-events-auto"
                  aria-label="Close profile card"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bubble Menu */}
      <AnimatePresence>
        {showBubbleMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] cursor-pointer"
              onClick={() => setShowBubbleMenu(false)}
            />
            
            {/* Bubble Menu Container */}
            <div
              ref={bubbleMenuRef}
              className="fixed inset-0 z-[1000] pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <BubbleMenu
                items={[
                  {
                    label: 'Portfolio',
                    href: 'https://jaikrishna-portfolio.vercel.app/',
                    ariaLabel: 'Portfolio',
                    rotation: -8,
                    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
                  },
                  {
                    label: 'GitHub',
                    href: 'https://github.com/jaikrishna-j',
                    ariaLabel: 'GitHub',
                    rotation: 8,
                    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
                  },
                  {
                    label: 'LinkedIn',
                    href: 'https://www.linkedin.com/in/jaikrishna-j/',
                    ariaLabel: 'LinkedIn',
                    rotation: 8,
                    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
                  },
                  {
                    label: 'Mail',
                    href: 'mailto:jaikrishnajaisankar2005@gmail.com',
                    ariaLabel: 'Mail',
                    rotation: -8,
                    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
                  }
                ]}
                menuAriaLabel="Toggle navigation"
                menuBg="#ffffff"
                menuContentColor="#111111"
                useFixedPosition={true}
                animationEase="back.out(1.5)"
                animationDuration={0.5}
                staggerDelay={0.12}
                isOpen={showBubbleMenu}
                onClose={() => setShowBubbleMenu(false)}
              />
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
