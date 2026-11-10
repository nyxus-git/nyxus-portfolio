"use client";

import { useEffect, useState } from "react";
import NextImage from "next/image";
import { getImageUrl } from "@/lib/api";

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  /** pixel width hint (default 900) */
  width?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  /** Extra object-fit class. Defaults to cover */
  objectFit?: "cover" | "contain" | "fill" | "none";
  /** Fallback JSX when src is empty or fails */
  fallback?: React.ReactNode;
}

/**
 * Optimized image component:
 * - Local /images/… paths → served directly by Next.js static files
 * - Bulletproof sizing: absolute inset-0 when fill=true
 * - Skeleton shimmer while loading
 * - Graceful fallback: falls back to native <img> if NextImage fails
 */
export function OptimizedImage({
  src,
  alt,
  width = 900,
  fill = true,
  className = "",
  priority = false,
  objectFit = "cover",
  fallback,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [useFallbackImg, setUseFallbackImg] = useState(false);
  const [errored, setErrored] = useState(false);

  const resolvedSrc = getImageUrl(src, width);

  useEffect(() => {
    setLoaded(false);
    setUseFallbackImg(false);
    setErrored(false);
  }, [resolvedSrc]);

  if (!resolvedSrc || errored) {
    return <>{fallback ?? null}</>;
  }

  const fitClass =
    objectFit === "contain"
      ? "object-contain"
      : objectFit === "fill"
      ? "object-fill"
      : objectFit === "none"
      ? "object-none"
      : "object-cover";

  // Container styling: strictly separate fill vs non-fill
  const containerClass = fill
    ? "absolute inset-0 w-full h-full overflow-hidden"
    : "relative w-full h-full overflow-hidden";

  // Fallback direct <img> in case Next.js optimizer fails
  if (useFallbackImg) {
    return (
      <div className={containerClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedSrc}
          alt={alt}
          className={`${fill ? "absolute inset-0 w-full h-full" : "w-full h-full"} ${fitClass} ${className}`}
          onError={() => setErrored(true)}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {/* Subtle skeleton shimmer while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-gray-800/60 to-gray-900/60 animate-pulse pointer-events-none" />
      )}

      <NextImage
        src={resolvedSrc}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : Math.round(width * 0.75)}
        priority={priority}
        unoptimized={resolvedSrc.startsWith("/images/uploads/")}
        className={`${fitClass} ${fill ? "w-full h-full" : ""} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-90"} ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => setUseFallbackImg(true)}
        sizes={
          fill
            ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 900px"
            : `${width}px`
        }
      />
    </div>
  );
}
