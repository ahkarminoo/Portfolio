"use client";

import PixelBlast from "@/components/effects/PixelBlast";

export function SiteBackground() {
  return (
    <div className="site-bg" aria-hidden>
      <PixelBlast
        variant="diamond"
        pixelSize={4}
        patternScale={2}
        patternDensity={1}
        pixelSizeJitter={0.12}
        enableRipples
        rippleSpeed={0.38}
        rippleThickness={0.12}
        rippleIntensityScale={1.15}
        liquid={false}
        antialias={false}
        speed={0.42}
        edgeFade={0.28}
        transparent
        autoPauseOffscreen
      />
    </div>
  );
}
