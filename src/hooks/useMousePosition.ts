import { useState, useEffect } from "react";
import { MousePosition } from "../lib/types";
 
export const useMousePosition = (normalizer = 4) => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      let clientX: number, clientY: number;
      
      if (e instanceof TouchEvent && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      setPosition({
        x: (clientX - window.innerWidth / 2) / normalizer,
        y: (clientY - window.innerHeight / 2) / normalizer,
      });
    };

    // Use passive listeners for better performance
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
    };
  }, [normalizer]);

  return position;
};