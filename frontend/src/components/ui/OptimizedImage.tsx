"use client";

import { useState } from "react";
import NextImage from "next/image";
import { getImageUrl, getBlurUrl } from "@/lib/api";

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  /** pixel width to request from Cloudinary (default 900) */
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
 * Hybrid-optimized image component:
 * - Cloudinary URLs → f_auto,q_auto,w_<width> (WebP/AVIF, compressed, direct CDN via unoptimized)
 * - Local /images/… or /profile.jpeg → served directly
 * - Bulletproof sizing: absolute inset-0 when fill=true, avoiding CSS relative/absolute collisions
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
  const blurSrc = getBlurUrl(src);

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

  // Container styling: strictly separate fill vs non-fill to prevent position: relative overriding position: absolute
  const containerClass = fill
    ? "absolute inset-0 w-full h-full overflow-hidden"
    : "relative w-full h-full overflow-hidden";

  const isCloudinary = resolvedSrc.includes("res.cloudinary.com");

  // Fallback direct <img> in case Next.js optimizer fails or if user requested fallback
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
      {/* LQIP blur backdrop — only for Cloudinary */}
      {blurSrc && !loaded && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={blurSrc}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-md pointer-events-none"
        />
      )}

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
        unoptimized={isCloudinary}
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
