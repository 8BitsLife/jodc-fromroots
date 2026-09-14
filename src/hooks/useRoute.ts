import { useEffect, useState, useCallback } from "react";

export type Route = "home" | "repo-of-the-week" | "hackathon" | "team";

/** Every non-home route lives at `/<route>`; home is `/`, optionally `/#section`. */
const PAGES: readonly Exclude<Route, "home">[] = ["repo-of-the-week", "hackathon", "team"];

function matchPage(value: string): Route | undefined {
  const slug = value.toLowerCase().replace(/^[#/]+|\/+$/g, "");
  return PAGES.find((page) => page === slug);
}

function getRouteFromLocation(): Route {
  if (typeof window === "undefined") return "home";
  return matchPage(window.location.pathname) ?? matchPage(window.location.hash) ?? "home";
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(getRouteFromLocation);

  useEffect(() => {
    // Old-style hash links (/#team) are rewritten to the real path (/team).
    const fromHash = matchPage(window.location.hash);
    if (fromHash) window.history.replaceState(null, "", `/${fromHash}`);

    const handleLocationChange = () => setRoute(getRouteFromLocation());

    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const navigate = useCallback((target: Route, sectionId?: string) => {
    if (target === "home") {
      window.history.pushState(null, "", sectionId ? `/#${sectionId}` : "/");
    } else {
      window.history.pushState(null, "", `/${target}`);
    }
    setRoute(target);

    // Wait a tick so the home sections exist before scrolling to one of them.
    window.setTimeout(() => {
      const section = sectionId ? document.getElementById(sectionId) : null;
      if (target === "home" && section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 90);
  }, []);

  return { route, navigate };
}
