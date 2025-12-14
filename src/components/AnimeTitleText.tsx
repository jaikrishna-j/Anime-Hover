import { forwardRef } from "react";
import { motion } from "framer-motion";
import { ANIMATION_CONFIG } from "../lib/constant";
import { AnimeTitle } from "../lib/types";

type AnimeTitleTextProps = {
  title: AnimeTitle;
  onHover: (text: string) => void;
  onHoverEnd: () => void;
  isHovered?: boolean;
};

export const AnimeTitleText = forwardRef<HTMLDivElement, AnimeTitleTextProps>(({
  title,
  onHover,
  onHoverEnd,
  isHovered = false,
}, ref) => {
  const handleInteraction = (textId: string) => {
    onHover(textId);
  };

  const handleTouch = (textId: string) => {
    // On mobile, toggle behavior: tap to show, tap again to hide
    if (isHovered) {
      onHoverEnd();
    } else {
      handleInteraction(textId);
    }
  };

  return (
    <motion.div
      ref={ref}
      data-text={title.id}
      className="relative cursor-pointer select-none text-center no-select"
      animate={ANIMATION_CONFIG.initial}
      whileHover={ANIMATION_CONFIG.hover}
      whileTap={{ scale: 0.98 }}
      transition={ANIMATION_CONFIG.transition}
      onMouseEnter={(e) => handleInteraction(e.currentTarget.dataset.text!)}
      onMouseMove={(e) => handleInteraction(e.currentTarget.dataset.text!)}
      onMouseLeave={onHoverEnd}
      onTouchStart={(e) => {
        e.stopPropagation();
        const textId = e.currentTarget.dataset.text!;
        handleTouch(textId);
      }}
    >
      <motion.span
        className="block whitespace-nowrap text-2xl font-black uppercase tracking-tight text-zinc-200 transition-all duration-300 hover:text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
        whileHover={{ textShadow: "0 0 30px rgba(255,255,255,0.5)" }}
      >
        {title.displayName}
      </motion.span>
    </motion.div>
  );
});

AnimeTitleText.displayName = "AnimeTitleText";
