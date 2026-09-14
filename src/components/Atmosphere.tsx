import { motion, useScroll, useTransform } from "framer-motion";

/**
 * One fixed canvas behind every page, so sections read as panes over the same
 * surface instead of slabs with hard colour seams between them.
 *
 * Layers, back to front: three slow-breathing flame glows that drift a little
 * with scroll, then a vignette. Everything animates transform/opacity only.
 */
export function Atmosphere() {
  const { scrollYProgress } = useScroll();
  // Glows travel different ways as you read down the page.
  const glowA = useTransform(scrollYProgress, [0, 1], ["0vh", "38vh"]);
  const glowB = useTransform(scrollYProgress, [0, 1], ["0vh", "-30vh"]);
  const glowC = useTransform(scrollYProgress, [0, 1], ["0vh", "-12vh"]);

  return (
    <div aria-hidden="true" className="atmosphere">
      <motion.div className="atmosphere-glow atmosphere-glow-c" style={{ y: glowC }} />
      <motion.div className="atmosphere-glow atmosphere-glow-a" style={{ y: glowA }} />
      <motion.div className="atmosphere-glow atmosphere-glow-b" style={{ y: glowB }} />
      <div className="atmosphere-vignette" />
    </div>
  );
}
