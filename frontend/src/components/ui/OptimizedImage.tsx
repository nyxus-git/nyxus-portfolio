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
  /** Extra object-fit class when not fill. Defaults to object-cover */
  objectFit?: "cover" | "contain" | "fill" | "none";
  /** Fallback JSX when src is empty */
  fallback?: React.ReactNode;
}

/**
 * Hybrid-optimized image component:
 * - Cloudinary URLs → f_auto,q_auto,w_<width> (WebP/AVIF, compressed)
 * - Local /images/… or /profile.jpeg → served by Next.js edge CDN directly
 * - /uploads/… → proxied through backend
 * - Shows a blurred LQIP placeholder while loading (Cloudinary only)
 * - Smooth fade-in once fully loaded
 * - Falls back gracefully on error
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
  const [errored, setErrored] = useState(false);

  const resolvedSrc = getImageUrl(src, width);
  const blurSrc = getBlurUrl(src);

  if (!resolvedSrc || errored) {
    return <>{fallback ?? null}</>;
  }

  const fitClass =
    fill ? "" : `object-${objectFit}`;

  const isCloudinary = resolvedSrc.includes("res.cloudinary.com");
  const isLocal = resolvedSrc.startsWith("/");

  // Next.js <Image> works best with known domains; for local static files it's always fine.
  // For external (Cloudinary), we use it with remotePatterns already set in next.config.ts.
  if (isCloudinary || isLocal) {
    return (
      <div
        className={`relative overflow-hidden ${fill ? "absolute inset-0" : ""}`}
        style={fill ? undefined : { display: "contents" }}
      >
        {/* LQIP blur backdrop — only for Cloudinary */}
        {blurSrc && !loaded && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blurSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-md"
          />
        )}

        {/* Skeleton shimmer while loading */}
        {!loaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-pulse" />
        )}

        <NextImage
          src={resolvedSrc}
          alt={alt}
          fill={fill}
          priority={priority}
          className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${fitClass} ${className}`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          sizes={
            fill
              ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 900px"
              : `${width}px`
          }
        />
      </div>
    );
  }

  // Fallback: plain img for /uploads/ proxied through backend
  return (
    <div className={`relative overflow-hidden ${fill ? "absolute inset-0" : ""}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-pulse" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolvedSrc}
        alt={alt}
        className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${fill ? "absolute inset-0 w-full h-full" : ""} object-${objectFit} ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}
