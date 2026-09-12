import { useEffect, useState } from "react";

const QUERY = "(pointer: fine)";

/** True on devices with a precise pointer — i.e. a mouse, not a finger. */
export function usePointerFine(): boolean {
  const [fine, setFine] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = () => setFine(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return fine;
}
