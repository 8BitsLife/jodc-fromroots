/**
 * Procedural textures for the interactive blur-reveal backdrop.
 *
 * The upstream component shipped two defaults we deliberately do not use:
 * a ~250KB base64 photograph (which would sit in the JS bundle forever) and a
 * noise PNG on a third-party CDN (an extra request that can fail on CORS).
 * Both are generated here instead — on brand, zero bytes shipped, no network.
 */

const INK = "#07070a";

const FLAME = "255, 122, 26";

/** Tiling RGBA noise, used by the shader for grain and UV distortion. */
export function createNoiseDataUrl(size = 256): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const image = ctx.createImageData(size, size);
  for (let i = 0; i < image.data.length; i += 4) {
    image.data[i] = Math.random() * 255;
    image.data[i + 1] = Math.random() * 255;
    image.data[i + 2] = Math.random() * 255;
    image.data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);

  return canvas.toDataURL("image/png");
}

/** One wedge of the JODC mark, as an annular sector. */
function wedge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  inner: number,
  outer: number,
  startDeg: number,
  sweepDeg: number,
) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  ctx.beginPath();
  ctx.arc(cx, cy, outer, toRad(startDeg), toRad(startDeg + sweepDeg));
  ctx.arc(cx, cy, inner, toRad(startDeg + sweepDeg), toRad(startDeg), true);
  ctx.closePath();
  ctx.fill();
}

/** Deterministic lattice noise in [0, 1], smoothed between integer points. */
function valueNoise(seed: number) {
  const hash = (x: number, y: number) => {
    let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };
  const smooth = (t: number) => t * t * (3 - 2 * t);

  return (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const u = smooth(x - xi);
    const v = smooth(y - yi);
    const top = hash(xi, yi) + (hash(xi + 1, yi) - hash(xi, yi)) * u;
    const bottom = hash(xi, yi + 1) + (hash(xi + 1, yi + 1) - hash(xi, yi + 1)) * u;
    return top + (bottom - top) * v;
  };
}

const SURVEY_LABELS = ["main", "v1.0.0", "+128 −12", "a3f9c2e", "#482", "HEAD", "merge", "0x80"];

/**
 * Topographic contours over a noise terrain whose summit sits under the club
 * mark, traced with marching squares. Lines warm from faint white at sea level
 * to flame near the peak; every fourth one is a heavier index contour, and a
 * handful carry small survey labels, the way a map marks its elevations.
 */
function drawContours(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  peakX: number,
  peakY: number,
  peakR: number,
) {
  const noise = valueNoise(Math.floor(Math.random() * 1e6));
  const cell = Math.max(5, Math.round(Math.max(width, height) / 260));
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  const scale = 1 / (Math.max(width, height) * 0.22);
  const spread = peakR * 2.6;

  // Height field: layered noise for rolling terrain, plus a summit at the mark.
  const field = new Float32Array(cols * rows);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = i * cell;
      const y = j * cell;
      const nx = x * scale;
      const ny = y * scale;
      const terrain =
        noise(nx, ny) * 0.55 + noise(nx * 2.1 + 17, ny * 2.1 + 5) * 0.3 + noise(nx * 4.3 + 3, ny * 4.3 + 29) * 0.15;
      const d = Math.hypot(x - peakX, y - peakY) / spread;
      const summit = Math.exp(-d * d);
      field[j * cols + i] = terrain * 0.42 + summit * 0.72;
    }
  }

  const levels = 24;
  const at = (i: number, j: number) => field[j * cols + i];
  const labelSpots: Array<{ x: number; y: number; angle: number }> = [];

  for (let l = 1; l < levels; l++) {
    const level = l / levels;
    const index = l % 4 === 0;
    const heat = Math.max(0, (level - 0.45) / 0.55);

    ctx.beginPath();
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const a = at(i, j);
        const b = at(i + 1, j);
        const c = at(i + 1, j + 1);
        const d = at(i, j + 1);
        const code = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
        if (code === 0 || code === 15) continue;

        const x = i * cell;
        const y = j * cell;
        const lerp = (p: number, q: number) => (level - p) / (q - p || 1e-6);
        const top: [number, number] = [x + lerp(a, b) * cell, y];
        const right: [number, number] = [x + cell, y + lerp(b, c) * cell];
        const bottom: [number, number] = [x + lerp(d, c) * cell, y + cell];
        const left: [number, number] = [x, y + lerp(a, d) * cell];

        const segments: Array<[[number, number], [number, number]]> = [];
        switch (code) {
          case 1: case 14: segments.push([left, bottom]); break;
          case 2: case 13: segments.push([bottom, right]); break;
          case 3: case 12: segments.push([left, right]); break;
          case 4: case 11: segments.push([top, right]); break;
          case 6: case 9: segments.push([top, bottom]); break;
          case 7: case 8: segments.push([left, top]); break;
          case 5: segments.push([left, top], [bottom, right]); break;
          case 10: segments.push([top, right], [left, bottom]); break;
        }
        for (const [p, q] of segments) {
          ctx.moveTo(p[0], p[1]);
          ctx.lineTo(q[0], q[1]);
        }

        // Occasionally remember a spot on an index contour for a label.
        if (index && labelSpots.length < 240 && Math.random() < 0.03) {
          const [p, q] = segments[0];
          labelSpots.push({ x: (p[0] + q[0]) / 2, y: (p[1] + q[1]) / 2, angle: Math.atan2(q[1] - p[1], q[0] - p[0]) });
        }
      }
    }

    ctx.lineWidth = index ? 1.8 : 1;
    ctx.strokeStyle =
      heat > 0
        ? `rgba(${FLAME}, ${(index ? 0.7 : 0.4) * (0.5 + heat * 0.5)})`
        : `rgba(245, 245, 244, ${(index ? 0.2 : 0.09) + level * 0.08})`;
    ctx.stroke();
  }

  // A few well-spaced survey labels, kept upright and away from each other.
  const placed: Array<{ x: number; y: number }> = [];
  const minGap = Math.max(width, height) * 0.14;
  ctx.font = `500 ${Math.max(10, Math.round(cell * 1.9))}px "JetBrains Mono", ui-monospace, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const spot of labelSpots) {
    if (placed.length >= 6) break;
    if (spot.x < 40 || spot.x > width - 40 || spot.y < 40 || spot.y > height - 40) continue;
    if (placed.some((p) => Math.hypot(p.x - spot.x, p.y - spot.y) < minGap)) continue;

    let angle = spot.angle;
    if (angle > Math.PI / 2) angle -= Math.PI;
    if (angle < -Math.PI / 2) angle += Math.PI;
    // Only label gently sloping stretches, so every label reads left to right.
    if (Math.abs(angle) > Math.PI / 6) continue;
    const text = SURVEY_LABELS[placed.length % SURVEY_LABELS.length];

    ctx.save();
    ctx.translate(spot.x, spot.y);
    ctx.rotate(angle);
    const w = ctx.measureText(text).width + 10;
    // Knock the contour out behind the label, like a printed map.
    ctx.fillStyle = "rgba(7, 7, 10, 0.82)";
    ctx.fillRect(-w / 2, -cell * 1.3, w, cell * 2.6);
    ctx.fillStyle = placed.length % 3 === 0 ? `rgba(${FLAME}, 0.8)` : "rgba(245, 245, 244, 0.42)";
    ctx.fillText(text, 0, 0);
    ctx.restore();

    placed.push(spot);
  }
}

/**
 * The image the shader frosts over and the cursor clears: ink ground, flame
 * blooms, a topographic heat map whose summit is the club mark, a few survey
 * labels on the contours, and the mark itself burning in from the right.
 */
export function createBrandBackdropDataUrl(width: number, height: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, width, height);

  // Flame blooms — the light source the frost diffuses.
  const blooms: Array<[number, number, number, number]> = [
    [width * 0.34, height * 0.42, Math.max(width, height) * 0.55, 0.4],
    [width * 0.82, height * 0.78, Math.max(width, height) * 0.4, 0.24],
    [width * 0.08, height * 0.92, Math.max(width, height) * 0.3, 0.16],
  ];

  for (const [x, y, radius, alpha] of blooms) {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
    glow.addColorStop(0, `rgba(${FLAME}, ${alpha})`);
    glow.addColorStop(0.45, `rgba(${FLAME}, ${alpha * 0.3})`);
    glow.addColorStop(1, "rgba(255, 122, 26, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  // The club mark, oversized and half off-canvas. Portrait viewports get a
  // smaller mark pushed further out, so it stays texture rather than subject.
  const portrait = height > width;
  const markX = width * (portrait ? 1.02 : 0.86);
  const markY = height * (portrait ? 0.34 : 0.44);
  const markR = Math.min(width, height) * (portrait ? 0.52 : 0.46);
  const markAlpha = portrait ? 0.62 : 1;

  drawContours(ctx, width, height, markX, markY, markR);

  // Vignette, so the edges sink back into the page. Drawn before the mark so
  // the mark — the one light source that should cut through — isn't dimmed.
  const vignette = ctx.createRadialGradient(
    width * 0.45,
    height * 0.45,
    Math.min(width, height) * 0.2,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.78,
  );
  vignette.addColorStop(0, "rgba(7, 7, 10, 0)");
  vignette.addColorStop(1, "rgba(7, 7, 10, 0.92)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  drawGlowingMark(ctx, markX, markY, markR, markAlpha);

  return canvas.toDataURL("image/jpeg", 0.92);
}

/**
 * The club mark, lit from behind. It has to read through the shader's wide
 * frost blur, but when the cursor clears the frost it must still look exactly
 * like the logo — so the glow lives only in soft gradients around and behind
 * the mark, and the mark itself stays three flat, clean shapes.
 */
function drawGlowingMark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  alpha: number,
) {
  const radial = (radius: number, stops: Array<[number, string]>) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    for (const [offset, color] of stops) g.addColorStop(offset, color);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  // Backlight: a broad, gentle warm halo that the frost spreads into a glow.
  radial(r * 2.1, [
    [0, `rgba(${FLAME}, ${0.12 * alpha})`],
    [0.45, `rgba(${FLAME}, ${0.05 * alpha})`],
    [1, "rgba(255, 122, 26, 0)"],
  ]);

  // Ring.
  ctx.strokeStyle = `rgba(245, 245, 244, ${0.16 * alpha})`;
  ctx.lineWidth = r * 0.07;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();

  // Core.
  ctx.fillStyle = `rgba(245, 245, 244, ${0.11 * alpha})`;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.58, 0, Math.PI * 2);
  ctx.fill();

  // Wedges.
  ctx.fillStyle = `rgba(${FLAME}, ${0.52 * alpha})`;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - r * 0.33, y - r * 0.78);
  ctx.lineTo(x + r * 0.33, y - r * 0.78);
  ctx.closePath();
  ctx.fill();
  wedge(ctx, x, y, r * 0.74, r * 1.22, 118, 46);
  wedge(ctx, x, y, r * 0.74, r * 1.22, 16, 46);
}