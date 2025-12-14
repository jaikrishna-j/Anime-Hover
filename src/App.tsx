import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
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
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-8 sm:py-12 md:py-16 lg:py-20">
      <Toaster position="top-center" richColors />
      
      {/* Anime Titles */}
      <div 
        ref={titlesContainerRef}
        className="flex w-full max-w-5xl flex-col items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6"
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
