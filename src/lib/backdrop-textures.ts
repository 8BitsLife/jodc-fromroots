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

/**
 * The image the shader frosts over and the cursor clears: ink ground, flame
 * blooms, an engineering grid, a commit-graph constellation, and the club mark
 * burning in from the right.
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

  // Engineering grid.
  ctx.strokeStyle = "rgba(255, 255, 255, 0.055)";
  ctx.lineWidth = 1;
  const step = Math.round(Math.max(width, height) / 22);
  for (let x = 0; x <= width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
    ctx.stroke();
  }

  // The club mark, oversized and half off-canvas. Portrait viewports get a
  // smaller mark pushed further out, so it stays texture rather than subject.
  const portrait = height > width;
  const markX = width * (portrait ? 1.02 : 0.86);
  const markY = height * (portrait ? 0.34 : 0.44);
  const markR = Math.min(width, height) * (portrait ? 0.52 : 0.46);
  const markAlpha = portrait ? 0.62 : 1;

  ctx.strokeStyle = `rgba(245, 245, 244, ${0.13 * markAlpha})`;
  ctx.lineWidth = markR * 0.07;
  ctx.beginPath();
  ctx.arc(markX, markY, markR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = `rgba(245, 245, 244, ${0.1 * markAlpha})`;
  ctx.beginPath();
  ctx.arc(markX, markY, markR * 0.58, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `rgba(${FLAME}, ${0.5 * markAlpha})`;
  ctx.beginPath();
  ctx.moveTo(markX, markY);
  ctx.lineTo(markX - markR * 0.33, markY - markR * 0.78);
  ctx.lineTo(markX + markR * 0.33, markY - markR * 0.78);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = `rgba(${FLAME}, ${0.42 * markAlpha})`;
  wedge(ctx, markX, markY, markR * 0.74, markR * 1.22, 118, 46);
  wedge(ctx, markX, markY, markR * 0.74, markR * 1.22, 16, 46);

  // Commit-graph constellation.
  const nodeCount = Math.round((width * height) / 26000);
  const nodes = Array.from({ length: nodeCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 2.4 + 1,
    hot: Math.random() > 0.72,
  }));

  const linkDistance = Math.max(width, height) * 0.13;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance > linkDistance) continue;

      const strength = 1 - distance / linkDistance;
      ctx.strokeStyle =
        a.hot && b.hot
          ? `rgba(${FLAME}, ${strength * 0.5})`
          : `rgba(255, 255, 255, ${strength * 0.16})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  for (const node of nodes) {
    ctx.fillStyle = node.hot
      ? `rgba(${FLAME}, 0.95)`
      : "rgba(255, 255, 255, 0.62)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Vignette, so the edges sink back into the page.
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

  return canvas.toDataURL("image/jpeg", 0.9);
}
