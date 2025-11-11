"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useId,
  useMemo,
  useCallback,
} from "react";

export interface GlassSurfaceProps {
  children?: React.ReactNode;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: "R" | "G" | "B";
  yChannel?: "R" | "G" | "B";
  mixBlendMode?:
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color-dodge"
    | "color-burn"
    | "hard-light"
    | "soft-light"
    | "difference"
    | "exclusion"
    | "hue"
    | "saturation"
    | "color"
    | "luminosity"
    | "plus-darker"
    | "plus-lighter";
  className?: string;
  style?: React.CSSProperties;
}

// Utility to extract Tailwind values
const extractTailwindValue = (
  className: string,
  prefix: string,
): string | null => {
  const regex = new RegExp(`\\b${prefix}-(\\S+)\\b`);
  const match = className.match(regex);
  return match ? match[1] : null;
};

// Map common Tailwind spacing values to pixels
const spacingMap: Record<string, number> = {
  "0": 0,
  "0.5": 2,
  "1": 4,
  "1.5": 6,
  "2": 8,
  "2.5": 10,
  "3": 12,
  "3.5": 14,
  "4": 16,
  "5": 20,
  "6": 24,
  "7": 28,
  "8": 32,
  "9": 36,
  "10": 40,
  "11": 44,
  "12": 48,
  "14": 56,
  "16": 64,
  "20": 80,
  "24": 96,
  "28": 112,
  "32": 128,
  "36": 144,
  "40": 160,
  "44": 176,
  "48": 192,
  "52": 208,
  "56": 224,
  "60": 240,
  "64": 256,
  "72": 288,
  "80": 320,
  "96": 384,
};

// Map Tailwind rounded values to pixels
const roundedMap: Record<string, number> = {
  none: 0,
  sm: 2,
  DEFAULT: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  full: 9999,
};

// Parse dimensions from className
const parseDimensions = (className: string = "") => {
  const dimensions: {
    width?: string | number;
    height?: string | number;
    borderRadius?: number;
  } = {};

  // Extract width
  const widthValue = extractTailwindValue(className, "w");
  if (widthValue) {
    if (widthValue === "full") dimensions.width = "100%";
    else if (widthValue === "screen") dimensions.width = "100vw";
    else if (widthValue === "min") dimensions.width = "min-content";
    else if (widthValue === "max") dimensions.width = "max-content";
    else if (widthValue === "fit") dimensions.width = "fit-content";
    else if (widthValue === "auto") dimensions.width = "auto";
    else if (widthValue.includes("/")) {
      const [numerator, denominator] = widthValue.split("/").map(Number);
      dimensions.width = `${((numerator / denominator) * 100).toFixed(2)}%`;
    } else if (spacingMap[widthValue])
      dimensions.width = spacingMap[widthValue];
    else if (widthValue.startsWith("[") && widthValue.endsWith("]")) {
      dimensions.width = widthValue.slice(1, -1);
    }
  }

  // Extract height
  const heightValue = extractTailwindValue(className, "h");
  if (heightValue) {
    if (heightValue === "full") dimensions.height = "100%";
    else if (heightValue === "screen") dimensions.height = "100vh";
    else if (heightValue === "min") dimensions.height = "min-content";
    else if (heightValue === "max") dimensions.height = "max-content";
    else if (heightValue === "fit") dimensions.height = "fit-content";
    else if (heightValue === "auto") dimensions.height = "auto";
    else if (heightValue.includes("/")) {
      const [numerator, denominator] = heightValue.split("/").map(Number);
      dimensions.height = `${((numerator / denominator) * 100).toFixed(2)}%`;
    } else if (spacingMap[heightValue])
      dimensions.height = spacingMap[heightValue];
    else if (heightValue.startsWith("[") && heightValue.endsWith("]")) {
      dimensions.height = heightValue.slice(1, -1);
    }
  }

  // Extract border radius
  const roundedValue = extractTailwindValue(className, "rounded");
  if (roundedValue) {
    dimensions.borderRadius = roundedMap[roundedValue] ?? roundedMap["DEFAULT"];
  } else if (className.includes("rounded")) {
    dimensions.borderRadius = roundedMap["DEFAULT"];
  }

  return dimensions;
};

// Check browser capabilities - fixed for SSR
const checkCapabilities = {
  supportsSVGFilters: (filterId: string): boolean => {
    if (typeof window === "undefined") return false;

    const isWebkit =
      /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);

    if (isWebkit || isFirefox) {
      return false;
    }

    try {
      const div = document.createElement("div");
      div.style.backdropFilter = `url(#${filterId})`;
      return div.style.backdropFilter !== "";
    } catch {
      return false;
    }
  },
  supportsBackdropFilter: (): boolean => {
    if (typeof window === "undefined") return false;
    try {
      return CSS.supports("backdrop-filter", "blur(10px)");
    } catch {
      return false;
    }
  },
};

const GlassSurface: React.FC<GlassSurfaceProps> = React.memo(
  ({
    children,
    borderWidth = 0.07,
    brightness = 50,
    opacity = 0.93,
    blur = 11,
    displace = 0,
    backgroundOpacity = 0,
    saturation = 1,
    distortionScale = -180,
    redOffset = 0,
    greenOffset = 10,
    blueOffset = 20,
    xChannel = "R",
    yChannel = "G",
    mixBlendMode = "difference",
    className = "",
    style = {},
  }) => {
    const uniqueId = useId().replace(/:/g, "-");
    const filterId = useMemo(() => `glass-filter-${uniqueId}`, [uniqueId]);
    const redGradId = useMemo(() => `red-grad-${uniqueId}`, [uniqueId]);
    const blueGradId = useMemo(() => `blue-grad-${uniqueId}`, [uniqueId]);

    const containerRef = useRef<HTMLDivElement>(null);
    const feImageRef = useRef<SVGFEImageElement>(null);
    const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
    const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
    const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
    const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);

    // Fix 1: Track mounted state to prevent hydration mismatch
    const [mounted, setMounted] = useState(false);

    const [containerSize, setContainerSize] = useState({
      width: 400,
      height: 200,
    });

    // Fix 2: Track capabilities after mount
    const [capabilities, setCapabilities] = useState({
      svgSupported: false,
      backdropSupported: false,
    });

    // Fix 3: Use CSS custom property for dark mode instead of JS state
    useEffect(() => {
      setMounted(true);

      // Check capabilities after mount
      const svgSupported = checkCapabilities.supportsSVGFilters(filterId);
      const backdropSupported = checkCapabilities.supportsBackdropFilter();
      setCapabilities({ svgSupported, backdropSupported });
    }, [filterId]);

    // Parse dimensions from className
    const dimensions = useMemo(() => parseDimensions(className), [className]);
    const borderRadius = dimensions.borderRadius ?? 20;

    // Memoize displacement map generation
    const generateDisplacementMap = useCallback(() => {
      const { width: actualWidth, height: actualHeight } = containerSize;
      const edgeSize =
        Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);

      const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `;

      return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
    }, [
      containerSize,
      borderWidth,
      borderRadius,
      redGradId,
      blueGradId,
      mixBlendMode,
      brightness,
      opacity,
      blur,
    ]);

    // Fix 4: Update displacement map only after mount
    const updateDisplacementMap = useCallback(() => {
      if (!feImageRef.current || !mounted) return;
      const dataUrl = generateDisplacementMap();
      feImageRef.current.setAttribute("href", dataUrl);
    }, [generateDisplacementMap, mounted]);

    // Update filter attributes after mount
    useEffect(() => {
      if (!mounted) return;

      updateDisplacementMap();

      const channels = [
        { ref: redChannelRef, offset: redOffset },
        { ref: greenChannelRef, offset: greenOffset },
        { ref: blueChannelRef, offset: blueOffset },
      ];

      channels.forEach(({ ref, offset }) => {
        if (ref.current) {
          ref.current.setAttribute(
            "scale",
            (distortionScale + offset).toString(),
          );
          ref.current.setAttribute("xChannelSelector", xChannel);
          ref.current.setAttribute("yChannelSelector", yChannel);
        }
      });

      if (gaussianBlurRef.current) {
        gaussianBlurRef.current.setAttribute(
          "stdDeviation",
          displace.toString(),
        );
      }
    }, [
      mounted,
      updateDisplacementMap,
      distortionScale,
      redOffset,
      greenOffset,
      blueOffset,
      xChannel,
      yChannel,
      displace,
    ]);

    // Handle resize with debouncing
    useEffect(() => {
      if (!mounted) return;

      const container = containerRef.current;
      if (!container) return;

      const resizeObserver = new ResizeObserver((entries) => {
        const rect = entries[0].contentRect;
        setContainerSize({
          width: Math.max(1, rect.width),
          height: Math.max(1, rect.height),
        });
      });

      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
      };
    }, [mounted]);

    // Memoize container styles
    const containerStyles = useMemo((): React.CSSProperties => {
      const baseStyles: React.CSSProperties = {
        ...style,
        ...(dimensions.width && {
          width:
            typeof dimensions.width === "number"
              ? `${dimensions.width}px`
              : dimensions.width,
        }),
        ...(dimensions.height && {
          height:
            typeof dimensions.height === "number"
              ? `${dimensions.height}px`
              : dimensions.height,
        }),
        borderRadius: `${borderRadius}px`,
        "--glass-frost": backgroundOpacity,
        "--glass-saturation": saturation,
      } as React.CSSProperties;

      // Don't apply effects until mounted to prevent hydration issues
      if (!mounted) {
        return baseStyles;
      }

      if (capabilities.svgSupported) {
        return {
          ...baseStyles,
          backdropFilter: `url(#${filterId}) saturate(${saturation})`,
        };
      }

      if (capabilities.backdropSupported) {
        return {
          ...baseStyles,
          backdropFilter: `blur(12px) saturate(1.8) brightness(1.1)`,
          WebkitBackdropFilter: `blur(12px) saturate(1.8) brightness(1.1)`,
        };
      }

      return baseStyles;
    }, [
      style,
      dimensions,
      borderRadius,
      backgroundOpacity,
      saturation,
      mounted,
      capabilities,
      filterId,
    ]);

    // Fix 5: Use CSS classes that work with media queries for dark mode
    const glassClasses = `
      glass-surface
      relative flex items-center justify-center overflow-hidden
      transition-opacity duration-[260ms] ease-out
      focus-visible:outline-2 focus-visible:outline-offset-2
      focus-visible:outline-[#007AFF] dark:focus-visible:outline-[#0A84FF]
      ${className}
    `;

    return (
      <>
        <style jsx>{`
          .glass-surface {
            background: hsl(0 0% 100% / var(--glass-frost, 0));
            box-shadow:
              0 0 2px 1px color-mix(in oklch, black, transparent 85%) inset,
              0 0 10px 4px color-mix(in oklch, black, transparent 90%) inset,
              0px 4px 16px rgba(17, 17, 26, 0.05),
              0px 8px 24px rgba(17, 17, 26, 0.05),
              0px 16px 56px rgba(17, 17, 26, 0.05);
          }

          @media (prefers-color-scheme: dark) {
            .glass-surface {
              background: hsl(0 0% 0% / var(--glass-frost, 0));
              box-shadow:
                0 0 2px 1px color-mix(in oklch, white, transparent 65%) inset,
                0 0 10px 4px color-mix(in oklch, white, transparent 85%) inset,
                0px 4px 16px rgba(17, 17, 26, 0.05),
                0px 8px 24px rgba(17, 17, 26, 0.05),
                0px 16px 56px rgba(17, 17, 26, 0.05);
            }
          }

          .glass-surface:not([data-svg-supported="true"]):not(
              [data-backdrop-supported="true"]
            ) {
            background: rgba(255, 255, 255, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow:
              inset 0 1px 0 0 rgba(255, 255, 255, 0.5),
              inset 0 -1px 0 0 rgba(255, 255, 255, 0.3);
          }

          @media (prefers-color-scheme: dark) {
            .glass-surface:not([data-svg-supported="true"]):not(
                [data-backdrop-supported="true"]
              ) {
              background: rgba(0, 0, 0, 0.4);
              border: 1px solid rgba(255, 255, 255, 0.2);
              box-shadow:
                inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 0 rgba(255, 255, 255, 0.1);
            }
          }

          .glass-surface[data-backdrop-supported="true"]:not(
              [data-svg-supported="true"]
            ) {
            background: rgba(255, 255, 255, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow:
              0 8px 32px 0 rgba(31, 38, 135, 0.2),
              0 2px 16px 0 rgba(31, 38, 135, 0.1),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
              inset 0 -1px 0 0 rgba(255, 255, 255, 0.2);
          }

          @media (prefers-color-scheme: dark) {
            .glass-surface[data-backdrop-supported="true"]:not(
                [data-svg-supported="true"]
              ) {
              background: rgba(255, 255, 255, 0.1);
              border: 1px solid rgba(255, 255, 255, 0.2);
              box-shadow:
                inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 0 rgba(255, 255, 255, 0.1);
            }
          }
        `}</style>

        <div
          ref={containerRef}
          className={glassClasses}
          style={containerStyles}
          data-svg-supported={mounted ? capabilities.svgSupported : undefined}
          data-backdrop-supported={
            mounted ? capabilities.backdropSupported : undefined
          }
        >
          {mounted && (
            <svg
              className="w-full h-full pointer-events-none absolute inset-0 opacity-0 -z-10"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <filter
                  id={filterId}
                  colorInterpolationFilters="sRGB"
                  x="0%"
                  y="0%"
                  width="100%"
                  height="100%"
                >
                  <feImage
                    ref={feImageRef}
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                    result="map"
                  />

                  <feDisplacementMap
                    ref={redChannelRef}
                    in="SourceGraphic"
                    in2="map"
                    result="dispRed"
                  />
                  <feColorMatrix
                    in="dispRed"
                    type="matrix"
                    values="1 0 0 0 0
                          0 0 0 0 0
                          0 0 0 0 0
                          0 0 0 1 0"
                    result="red"
                  />

                  <feDisplacementMap
                    ref={greenChannelRef}
                    in="SourceGraphic"
                    in2="map"
                    result="dispGreen"
                  />
                  <feColorMatrix
                    in="dispGreen"
                    type="matrix"
                    values="0 0 0 0 0
                          0 1 0 0 0
                          0 0 0 0 0
                          0 0 0 1 0"
                    result="green"
                  />

                  <feDisplacementMap
                    ref={blueChannelRef}
                    in="SourceGraphic"
                    in2="map"
                    result="dispBlue"
                  />
                  <feColorMatrix
                    in="dispBlue"
                    type="matrix"
                    values="0 0 0 0 0
                          0 0 0 0 0
                          0 0 1 0 0
                          0 0 0 1 0"
                    result="blue"
                  />

                  <feBlend in="red" in2="green" mode="screen" result="rg" />
                  <feBlend in="rg" in2="blue" mode="screen" result="output" />
                  <feGaussianBlur
                    ref={gaussianBlurRef}
                    in="output"
                    stdDeviation="0.7"
                  />
                </filter>
              </defs>
            </svg>
          )}

          <div className="w-full h-full flex items-center justify-center p-2 rounded-[inherit] relative z-10">
            {children}
          </div>
        </div>
      </>
    );
  },
);

GlassSurface.displayName = "GlassSurface";

export default GlassSurface;
