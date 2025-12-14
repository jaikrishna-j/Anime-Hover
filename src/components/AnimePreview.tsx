import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MousePosition } from "../lib/types";
import { AnimeSceneEntry } from "../lib/data";

type AnimePreviewProps = {
  hoveredText: string;
  item: AnimeSceneEntry;
  index: number;
  mousePosition: MousePosition;
  titlePosition?: { x: number; y: number } | null;
};

const getResponsiveSize = () => {
  if (typeof window === "undefined") return { width: 256, multiplier: 1 };
  
  const width = window.innerWidth;
  if (width < 640) return { width: 180, multiplier: 0.4 }; // Mobile
  if (width < 768) return { width: 200, multiplier: 0.5 }; // Small tablet
  if (width < 1024) return { width: 220, multiplier: 0.7 }; // Tablet
  if (width < 1280) return { width: 240, multiplier: 0.85 }; // Small desktop
  return { width: 256, multiplier: 1 }; // Desktop
};

const getResponsiveOffsets = (
  offsetX: number, 
  offsetY: number, 
  rotate: number, 
  index: number,
  titlePosition?: { x: number; y: number } | null
) => {
  const { multiplier, width } = getResponsiveSize();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  
  if (isMobile && titlePosition) {
    // Create rainbow/arc pattern above the title on mobile
    const previewHeight = (width * 2) / 3; // aspect ratio 3/2
    const mobileMultiplier = 0.35; // Scale down the desktop offsets for mobile
    
    // Create arc pattern: left, center-top, right (like desktop rainbow pattern)
    // Scale the desktop offsets proportionally for mobile
    const arcOffsetX = offsetX * mobileMultiplier;
    // Position above the title - use titlePosition.y as base, then add scaled offsetY
    // This ensures scenes appear just above the text, not too high
    const baseY = titlePosition.y - previewHeight - 30; // Start just above title
    const arcOffsetY = baseY + (offsetY * mobileMultiplier * 0.5); // Apply arc pattern
    
    return {
      offsetX: titlePosition.x + arcOffsetX, // Center horizontally on title, then apply arc offset
      offsetY: arcOffsetY, // Position above title in arc pattern
      rotate: rotate * 0.6, // Slightly reduce rotation for mobile
    };
  }
  
  return {
    offsetX: offsetX * multiplier,
    offsetY: offsetY * multiplier,
    rotate: rotate,
  };
};

export const AnimePreview = ({
  hoveredText,
  item,
  index,
  mousePosition,
  titlePosition,
}: AnimePreviewProps) => {
  const [responsiveSize, setResponsiveSize] = useState(getResponsiveSize());
  const [responsiveOffsets, setResponsiveOffsets] = useState(
    getResponsiveOffsets(item.offsetX, item.offsetY, item.rotate, index, titlePosition)
  );

  useEffect(() => {
    const handleResize = () => {
      setResponsiveSize(getResponsiveSize());
      setResponsiveOffsets(getResponsiveOffsets(item.offsetX, item.offsetY, item.rotate, index, titlePosition));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [item.offsetX, item.offsetY, item.rotate, index, titlePosition]);

  // Update offsets when titlePosition changes
  useEffect(() => {
    setResponsiveOffsets(getResponsiveOffsets(item.offsetX, item.offsetY, item.rotate, index, titlePosition));
  }, [titlePosition, item.offsetX, item.offsetY, item.rotate, index]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const mouseMultiplier = isMobile ? 0 : (index === 1 ? 0.5 : 1);

  return (
    <motion.div
      key={index}
      className="pointer-events-none absolute z-10 flex aspect-[3/2] items-center justify-center overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/10 backdrop-blur-sm sm:rounded-3xl"
      style={{ width: responsiveSize.width }}
      initial={{
        scale: 0,
        opacity: 0,
        x: responsiveOffsets.offsetX,
        y: responsiveOffsets.offsetY,
        rotate: responsiveOffsets.rotate,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        x: responsiveOffsets.offsetX + mousePosition.x * mouseMultiplier,
        y: responsiveOffsets.offsetY + mousePosition.y * mouseMultiplier,
        rotate: responsiveOffsets.rotate,
      }}
      exit={{ 
        scale: 0, 
        opacity: 0,
        transition: { duration: 0.2 }
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        mass: 0.6,
      }}
    >
      <img
        src={item.src}
        alt={`${hoveredText} scene ${index + 1}`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </motion.div>
  );
};
