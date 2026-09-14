import { useEffect, useState } from "react";
import InteractiveBlurReveal from "@/components/ui/interactive-blur-reveal";
import { createBrandBackdropDataUrl } from "@/lib/backdrop-textures";
import { usePointerFine } from "../hooks/usePointerFine";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** A software rasteriser will crawl through a fullscreen blur. Don't even try. */
function hasSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2");
    if (!gl) return true;

    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info
      ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : "";

    gl.getExtension("WEBGL_lose_context")?.loseContext();

    return /swiftshader|llvmpipe|software|basic render|microsoft basic/i.test(
      renderer,
    );
  } catch {
    return true;
  }
}

/**
 * Hero background: a frosted brand field the cursor wipes clear as it moves,
 * refreezing behind it.
 *
 * The reveal only means anything with a cursor, so touch devices, reduced-motion
 * visitors, software renderers, and any machine that can't hold a frame budget
 * get the same artwork rendered sharp and static — no WebGL, no rAF loop.
 */
export function HeroBackdrop() {
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();
  const [degraded, setDegraded] = useState(false);
  const [softwareGL, setSoftwareGL] = useState(false);

  useEffect(() => setSoftwareGL(hasSoftwareWebGL()), []);

  const interactive = fine && !reduced && !softwareGL && !degraded;

  // Watchdog: if the first ~90 frames are mostly over budget, this machine is
  // not enjoying the shader. Drop to the static image and stop the loop.
  useEffect(() => {
    if (!interactive) return;

    let raf = 0;
    let frames = 0;
    let slowFrames = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = now - last;
      last = now;
      frames += 1;
      if (delta > 45) slowFrames += 1;

      if (frames >= 90) {
        if (slowFrames > 45) setDegraded(true);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [interactive]);

  const [staticTexture, setStaticTexture] = useState<string | null>(null);

  useEffect(() => {
    if (interactive || staticTexture) return;

    setStaticTexture(
      createBrandBackdropDataUrl(
        Math.min(Math.round(window.innerWidth * 1.1), 1600),
        Math.min(Math.round(window.innerHeight * 1.1), 1100),
      ),
    );
  }, [interactive, staticTexture]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(180deg,#000_65%,transparent)]"
    >
      {interactive ? (
        <InteractiveBlurReveal
          mouseRadius={100}
          duration={0.42}
          resolutionScale={0.7}
          style={{ position: "absolute" }}
        />
      ) : (
        staticTexture && (
          <img
            src={staticTexture}
            alt=""
            className="h-full w-full object-cover opacity-90"
          />
        )
      )}

      {/* Live light over the mark in the texture: breathes slowly and is
          screen-blended, so it brightens the fog instead of covering it. */}
      <div className="hero-mark-glow" />

      {/* Scrim keeps the headline readable over the cleared image; the mask on
          the wrapper dissolves the bottom edge into the page atmosphere. */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-ink/5" />
    </div>
  );
}
