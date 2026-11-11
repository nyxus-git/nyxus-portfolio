"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableContentProps {
  children: React.ReactNode;
  maxHeight?: number;
  className?: string;
}

export function ExpandableContent({
  children,
  maxHeight = 150,
  className = "",
}: ExpandableContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > maxHeight);
    }
  }, [children, maxHeight]);

  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{ height: isExpanded ? "auto" : maxHeight }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`overflow-hidden relative ${!isExpanded && isOverflowing ? "mask-gradient" : ""}`}
        style={{
          maxHeight: isExpanded ? undefined : maxHeight,
        }}
      >
        <div ref={contentRef}>{children}</div>

        {!isExpanded && isOverflowing && (
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#090814]/95 to-transparent pointer-events-none" />
        )}
      </motion.div>

      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-primary hover:text-accent text-sm font-medium flex items-center gap-1 transition-colors z-10 relative"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp size={16} />
            </>
          ) : (
            <>
              Read More <ChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
